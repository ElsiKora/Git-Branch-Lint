import type { TBranchList } from "../../../domain/type/branch.type";
import type { IInputValidationResult } from "../../../domain/type/input-validation-result.type";
import type { IBranchChoiceFormatted } from "../type/branch-choice-formatted.type";
import type { IBranchPlaceholderPromptOptions } from "../type/branch-placeholder-prompt-options.type";
import type { IBranchTypeAnswer } from "../type/branch-type-answer.type";
import type { IPlaceholderAnswer } from "../type/placeholder-answer.type";
import type { IPushBranchAnswer } from "../type/push-branch-answer.type";

import inquirer from "inquirer";

import { ValidateBranchPlaceholderValueUseCase } from "../../../application/use-cases/validate-branch-placeholder-value.use-case";
import { BranchChoiceFormatter } from "../formatters/branch-choice.formatter";

/**
 * Prompt service for branch creation interactions
 */
export class BranchCreationPrompt {
	private readonly BRANCH_CHOICE_FORMATTER: BranchChoiceFormatter;

	private readonly VALIDATE_BRANCH_PLACEHOLDER_VALUE_USE_CASE: ValidateBranchPlaceholderValueUseCase;

	public constructor() {
		this.BRANCH_CHOICE_FORMATTER = new BranchChoiceFormatter();
		this.VALIDATE_BRANCH_PLACEHOLDER_VALUE_USE_CASE = new ValidateBranchPlaceholderValueUseCase();
	}

	/**
	 * Prompt for branch type selection
	 * @param branches Available branch types
	 * @returns Selected branch type
	 */
	public async promptBranchType(branches: TBranchList): Promise<string> {
		const choices: Array<IBranchChoiceFormatted> = this.BRANCH_CHOICE_FORMATTER.format(branches);

		const result: IBranchTypeAnswer = await inquirer.prompt<IBranchTypeAnswer>([
			{
				choices,
				message: "Select the type of branch you're creating:",
				name: "branchType",
				type: "list",
			},
		]);

		return result.branchType;
	}

	/**
	 * Prompt for a branch placeholder value based on a validation pattern.
	 */
	public async promptPlaceholder(options: IBranchPlaceholderPromptOptions): Promise<string> {
		const result: IPlaceholderAnswer = await inquirer.prompt<IPlaceholderAnswer>([
			{
				message: this.buildPlaceholderPromptMessage(options),
				name: "value",
				transformer: (input: string): string => {
					if (options.isOptional && input.trim() === "") {
						return "\u001B[2m(Enter to skip)\u001B[0m";
					}

					return input;
				},
				type: "input",
				validate: (input: string): string | true => {
					const validation: IInputValidationResult = this.VALIDATE_BRANCH_PLACEHOLDER_VALUE_USE_CASE.execute({
						isOptional: options.isOptional,
						patternSource: options.patternSource,
						placeholderName: options.placeholderName,
						value: input,
					});

					if (validation.isValid) {
						return true;
					}

					return validation.errorMessage ?? this.buildPlaceholderValidationMessage(options);
				},
			},
		]);

		return result.value.trim();
	}

	/**
	 * Prompt to push branch to remote
	 * @returns Whether to push the branch
	 */
	public async promptPushBranch(): Promise<boolean> {
		const result: IPushBranchAnswer = await inquirer.prompt<IPushBranchAnswer>([
			{
				// eslint-disable-next-line @elsikora/typescript/naming-convention
				default: false,
				message: "Do you want to push the branch to the remote repository?",
				name: "shouldPush",
				type: "confirm",
			},
		]);

		return result.shouldPush;
	}

	private buildPlaceholderPromptMessage(options: IBranchPlaceholderPromptOptions): string {
		const normalizedPlaceholderName: string = options.placeholderName.replaceAll("-", " ");
		const capitalizedPlaceholderName: string = normalizedPlaceholderName[0].toUpperCase() + normalizedPlaceholderName.slice(1);
		const optionalPart: string = options.isOptional ? " optional" : "";
		const examplePart: string = options.example ? `, e.g., ${options.example}` : "";

		return `${capitalizedPlaceholderName}${optionalPart}${examplePart}:`;
	}

	private buildPlaceholderValidationMessage(options: IBranchPlaceholderPromptOptions): string {
		return `Invalid ${options.placeholderName} format`;
	}
}
