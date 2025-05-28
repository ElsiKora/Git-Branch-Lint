import chalk from "chalk";

/**
 * Format error messages for CLI output
 */
export class ErrorFormatter {
	/**
	 * Format an error message
	 * @param message The error message
	 * @returns The formatted error message
	 */
	public format(message: string): string {
		return chalk.red(`✖ ${message}`);
	}
}
