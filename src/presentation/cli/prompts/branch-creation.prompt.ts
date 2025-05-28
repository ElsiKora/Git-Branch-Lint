import type { TBranchList } from "../../../domain/type/branch.type";

import inquirer from "inquirer";

import { ValidateBranchNameUseCase } from "../../../application/use-cases/validate-branch-name.use-case";
import { BranchChoiceFormatter } from "../formatters/branch-choice.formatter";

/**
 * Prompt service for branch creation interactions
 */
export class BranchCreationPrompt {
	private readonly BRANCH_CHOICE_FORMATTER: BranchChoiceFormatter;

	private readonly VALIDATE_BRANCH_NAME_USE_CASE: ValidateBranchNameUseCase;

	public constructor() {
		this.BRANCH_CHOICE_FORMATTER = new BranchChoiceFormatter();
		this.VALIDATE_BRANCH_NAME_USE_CASE = new ValidateBranchNameUseCase();
	}

	/**
	 * Prompt for branch name
	 * @returns Branch name
	 */
	public async promptBranchName(): Promise<string> {
		const result: { branchName: string } = await inquirer.prompt<{ branchName: string }>([
			{
				message: "Enter the branch name (e.g., authorization):",
				name: "branchName",
				type: "input",
				// eslint-disable-next-line @elsikora/sonar/function-return-type
				validate: (input: string): boolean | string => {
					const validation: { errorMessage?: string; isValid: boolean } = this.VALIDATE_BRANCH_NAME_USE_CASE.execute(input);

					if (validation.isValid) {
						return true;
					}

					return validation.errorMessage ?? "Invalid branch name";
				},
			},
		]);

		return result.branchName;
	}

	/**
	 * Prompt for branch type selection
	 * @param branches Available branch types
	 * @returns Selected branch type
	 */
	public async promptBranchType(branches: TBranchList): Promise<string> {
		const choices: Array<{ name: string; short: string; value: string }> = this.BRANCH_CHOICE_FORMATTER.format(branches);

		const result: { branchType: string } = await inquirer.prompt<{ branchType: string }>([
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
	 * Prompt to push branch to remote
	 * @returns Whether to push the branch
	 */
	public async promptPushBranch(): Promise<boolean> {
		const result: { shouldPush: boolean } = await inquirer.prompt<{ shouldPush: boolean }>([
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
}
