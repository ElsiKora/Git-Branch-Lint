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

				validate: (input: string): string | true => {
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

	/**
	 * Prompt for ticket ID (optional)
	 * @returns Ticket ID in uppercase or empty string if skipped
	 */
	public async promptTicketId(): Promise<string> {
		const result: { ticketId: string } = await inquirer.prompt<{ ticketId: string }>([
			{
				message: "Ticket ID (optional, e.g., PROJ-123):",
				name: "ticketId",

				transformer: (input: string): string => {
					// Show placeholder when empty
					return input.trim() === "" ? "\u001B[2m(Enter to skip)\u001B[0m" : input;
				},
				type: "input",

				validate: (input: string): string | true => {
					// Empty is valid (optional field)
					if (!input || input.trim() === "") {
						return true;
					}

					// Convert to uppercase for validation
					const upperInput: string = input.trim().toUpperCase();

					// Validate format: 2+ uppercase letters, dash, digits
					const ticketPattern: RegExp = /^[A-Z]{2,}-\d+$/;

					if (!ticketPattern.test(upperInput)) {
						return "Invalid format. Expected format: PROJ-123 (2+ letters, dash, numbers)";
					}

					return true;
				},
			},
		]);

		// Return uppercase version or empty string
		const trimmed: string = result.ticketId.trim();

		return trimmed ? trimmed.toUpperCase() : "";
	}
}
