import type { BranchLintConfig } from "../../../domain/interfaces/config.type";

import chalk from "chalk";

import { PatternMatchError, ProhibitedBranchError } from "../../../domain/errors/lint-errors";

/**
 * Format hint messages for CLI output
 */
export class HintFormatter {
	/**
	 * Format a hint message based on error type and config
	 * @param error The error that occurred
	 * @param config The branch configuration
	 * @returns The formatted hint message
	 */
	public format(error: unknown, config: BranchLintConfig): string {
		let output: string = "";

		if (error instanceof PatternMatchError) {
			output += this.formatPatternMatchHint(config);
		} else if (error instanceof ProhibitedBranchError) {
			output += this.formatProhibitedBranchHint(config);
		}

		return output;
	}

	/**
	 * Format a hint for pattern match errors
	 * @param config The branch configuration
	 * @returns The formatted hint
	 */
	private formatPatternMatchHint(config: BranchLintConfig): string {
		let output: string = "";
		const branchNamePattern: string | undefined = config.rules?.["branch-pattern"];
		const branchTypeList: Array<string> = Array.isArray(config.branches) ? config.branches : Object.keys(config.branches);

		output += branchNamePattern ? `${chalk.blue("Expected pattern:")} ${chalk.yellow(branchNamePattern)}\n` : "";

		const valuesList: string = branchTypeList.map((value: string) => chalk.yellow(value)).join(", ");
		output += chalk.blue(`Valid branch types:`) + " " + valuesList + "\n";

		return output.trim();
	}

	/**
	 * Format a hint for prohibited branch errors
	 * @param config The branch configuration
	 * @returns The formatted hint
	 */
	private formatProhibitedBranchHint(config: BranchLintConfig): string {
		const prohibitedList: string = config.rules?.["branch-prohibited"]?.map((name: string) => chalk.yellow(name)).join(", ") ?? "";

		return `${chalk.blue("Prohibited branch names:")} ${prohibitedList}`;
	}
}
