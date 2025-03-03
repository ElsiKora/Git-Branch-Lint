import type { IBranchConfig } from "../../../domain/interfaces/branch-interfaces";

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
	public format(error: unknown, config: IBranchConfig): string {
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
	private formatPatternMatchHint(config: IBranchConfig): string {
		let output: string = "";

		output += `${chalk.blue("Expected pattern:")} ${chalk.yellow(config.PATTERN)}\n`;

		// Format the parameters
		for (const [parameterName, parameterValues] of Object.entries(config.PARAMS)) {
			const valuesList: string = (parameterValues as Array<string>).map((value: string) => chalk.yellow(value)).join(", ");

			output += chalk.blue(`Valid ${parameterName} values:`) + " " + valuesList + "\n";
		}

		return output.trim();
	}

	/**
	 * Format a hint for prohibited branch errors
	 * @param config The branch configuration
	 * @returns The formatted hint
	 */
	private formatProhibitedBranchHint(config: IBranchConfig): string {
		const prohibitedList: string = config.PROHIBITED.map((name: string) => chalk.yellow(name)).join(", ");

		return `${chalk.blue("Prohibited branch names:")} ${prohibitedList}`;
	}
}
