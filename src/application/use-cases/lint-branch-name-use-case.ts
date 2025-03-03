import type { IBranchConfig, TBranchName } from "../../domain/interfaces/branch-interfaces";

import { Branch } from "../../domain/entities/branch";
import { PatternMatchError, ProhibitedBranchError } from "../../domain/errors/lint-errors";

/**
 * Use case for linting a branch name
 */
export class LintBranchNameUseCase {
	/**
	 * Lint a branch name against a configuration
	 * @param branchName The branch name to lint
	 * @param config The branch configuration
	 * @throws {ProhibitedBranchError} When branch name is prohibited
	 * @throws {PatternMatchError} When branch name doesn't match pattern
	 */
	public execute(branchName: TBranchName, config: IBranchConfig): void {
		const branch: Branch = new Branch(branchName);

		if (branch.isProhibited(config.PROHIBITED)) {
			throw new ProhibitedBranchError(branchName);
		}

		this.validatePattern(branch.getName(), config);
	}

	/**
	 * Validate the branch name against the pattern
	 * @param branchName The branch name to validate
	 * @param config The branch configuration
	 * @throws {PatternMatchError} When branch name doesn't match pattern
	 */
	private validatePattern(branchName: TBranchName, config: IBranchConfig): void {
		// Start with original pattern
		let pattern: string = config.PATTERN;

		// Process each parameter in the configuration
		for (const [key, values] of Object.entries(config.PARAMS)) {
			// Create the placeholder - IMPORTANT: Convert to lowercase to match pattern
			const placeholder: string = `:${key.toLowerCase()}`;

			const parameterValues: Array<string> = values as Array<string>;

			let replacement: string = "(";

			for (let index: number = 0; index < parameterValues.length; index++) {
				const value: string = parameterValues[index];

				// Add the value to the replacement pattern
				if (value.startsWith("[")) {
					replacement += value;
				} else {
					const escapedValue: string = value.replaceAll(/[-/\\^$*+?.()|[\]{}]/g, String.raw`\$&`);
					replacement += escapedValue;
				}

				// Add OR separator if not the last value
				if (index < parameterValues.length - 1) {
					replacement += "|";
				}
			}

			replacement += ")";

			// Replace the placeholder in the pattern
			pattern = pattern.replaceAll(new RegExp(placeholder, "g"), replacement);
		}

		// Create the regular expression
		const regexp: RegExp = new RegExp(`^${pattern}$`);

		// Test the branch name against the pattern
		if (!regexp.test(branchName)) {
			throw new PatternMatchError(branchName);
		}
	}
}
