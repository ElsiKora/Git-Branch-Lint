import type { IBranchDetails, TBranchList } from "../../../domain/type/branch.type";
import type { IBranchChoiceFormatted } from "../type/branch-choice-formatted.type";

/**
 * Formatter for branch choices in CLI prompts
 */
export class BranchChoiceFormatter {
	// eslint-disable-next-line @elsikora/typescript/no-magic-numbers
	private readonly EMPTY_SPACING_OFFSET: number = 5;

	/**
	 * Format branch list for CLI selection
	 * @param branchList The list of branches to format
	 * @returns Formatted choices for inquirer prompt
	 */
	public format(branchList: TBranchList): Array<IBranchChoiceFormatted> {
		if (Array.isArray(branchList)) {
			return this.formatSimpleList(branchList);
		}

		return this.formatDetailedList(branchList);
	}

	/**
	 * Format detailed branch list (object with descriptions)
	 */
	private formatDetailedList(branchList: Record<string, IBranchDetails>): Array<IBranchChoiceFormatted> {
		const branchNames: Array<string> = Object.keys(branchList);
		const maxNameLength: number = Math.max(...branchNames.map((name: string) => name.length));

		return branchNames.map((branchName: string) => {
			const branch: IBranchDetails = branchList[branchName];
			const padding: string = " ".repeat(maxNameLength - branchName.length + this.EMPTY_SPACING_OFFSET);

			return {
				name: `${branch.title}:${padding}${branch.description}`,
				short: branch.title,
				value: branchName,
			};
		});
	}

	/**
	 * Format simple branch list (array of strings)
	 */
	private formatSimpleList(branchList: Array<string>): Array<IBranchChoiceFormatted> {
		return branchList.map((branchName: string) => ({
			name: branchName,
			short: branchName,
			value: branchName,
		}));
	}
}
