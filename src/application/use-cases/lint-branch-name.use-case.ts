import type { IBranchLintConfig } from "../../domain/type/config.type";

import { Branch } from "../../domain/entity/branch.entity";
import { BranchTooLongError, BranchTooShortError, PatternMatchError, ProhibitedBranchError } from "../../domain/errors/lint.error";

/**
 * Use case for linting branch names
 */
export class LintBranchNameUseCase {
	/**
	 * Execute the use case
	 * @param branchName The branch name to lint
	 * @param config The branch configuration
	 * @throws {ProhibitedBranchError} When branch name is prohibited
	 * @throws {PatternMatchError} When branch name doesn't match pattern
	 * @throws {BranchTooShortError} When branch name is shorter than the minimum length
	 * @throws {BranchTooLongError} When branch name is longer than the maximum length
	 */
	public execute(branchName: string, config: IBranchLintConfig): void {
		const branch: Branch = new Branch(branchName);
		const configRules: Partial<typeof config.rules> = config.rules ?? {};
		const ignoreList: Array<string> = config.ignore ?? [];

		if (configRules?.["branch-prohibited"] && branch.isProhibited(configRules["branch-prohibited"])) {
			throw new ProhibitedBranchError(branchName);
		}

		if (ignoreList.length > 0 && ignoreList.includes(branchName)) {
			return;
		}

		if (configRules?.["branch-min-length"] && branch.isTooShort(configRules["branch-min-length"])) {
			throw new BranchTooShortError(branchName, configRules["branch-min-length"]);
		}

		if (configRules?.["branch-max-length"] && branch.isTooLong(configRules["branch-max-length"])) {
			throw new BranchTooLongError(branchName, configRules["branch-max-length"]);
		}

		this.validatePattern(branch.getName(), config);
	}

	/**
	 * Test a branch name against a specific pattern
	 * @param branchName The branch name to test
	 * @param pattern The pattern to test against
	 * @param branchTypes Available branch types
	 * @param subjectNamePattern Pattern for the name/description part
	 * @returns true if pattern matches
	 */
	private testPattern(branchName: string, pattern: string, branchTypes: Array<string>, subjectNamePattern?: string): boolean {
		let processedPattern: string = pattern;

		const parameters: Record<string, Array<string>> = {
			type: branchTypes,
			// Add ticket pattern if present
			...(processedPattern.includes(":ticket") && { ticket: ["[A-Z]{2,}-[0-9]+"] }),
			// Add name pattern if specified
			...(subjectNamePattern && { name: [subjectNamePattern] }),
		};

		// Process parameters
		for (const [key, values] of Object.entries(parameters)) {
			const placeholder: string = `:${key.toLowerCase()}`;
			let replacement: string = "(";

			for (let index: number = 0; index < values.length; index++) {
				const value: string = values[index];

				if (value.startsWith("[")) {
					replacement += value;
				} else {
					const escapedValue: string = value.replaceAll(/[-/\\^$*+?.()|[\]{}]/g, String.raw`\$&`);
					replacement += escapedValue;
				}

				if (index < values.length - 1) {
					replacement += "|";
				}
			}

			replacement += ")";
			processedPattern = processedPattern.replaceAll(new RegExp(placeholder, "g"), replacement);
		}

		// Create the regular expression
		const regexp: RegExp = new RegExp(`^${processedPattern}$`);

		// Test the branch name against the pattern
		return regexp.test(branchName);
	}

	/**
	 * Validate the branch name against the pattern
	 * @param branchName The branch name to validate
	 * @param config The branch configuration
	 * @throws {PatternMatchError} When branch name doesn't match pattern
	 */
	private validatePattern(branchName: string, config: IBranchLintConfig): void {
		// Start with original pattern
		const branchNamePattern: string | undefined = config.rules?.["branch-pattern"];
		const subjectNamePattern: string | undefined = config.rules?.["branch-subject-pattern"];

		if (!branchNamePattern) {
			return;
		}

		// Get branch types - handle both array and object formats
		const branchTypes: Array<string> = Array.isArray(config.branches) ? config.branches : Object.keys(config.branches);

		// Check if pattern contains :ticket placeholder
		const hasTicketPlaceholder: boolean = branchNamePattern.includes(":ticket");

		// Build patterns to try - with ticket and without ticket
		const patternsToTry: Array<string> = [];

		if (hasTicketPlaceholder) {
			// Try pattern with ticket: type/TICKET-123-description
			// Try pattern without ticket: type/description (replace :ticket- with empty)
			patternsToTry.push(branchNamePattern, branchNamePattern.replace(":ticket-", ""));
		} else {
			// Only one pattern available
			patternsToTry.push(branchNamePattern);
		}

		// Try each pattern
		for (const patternToTry of patternsToTry) {
			if (this.testPattern(branchName, patternToTry, branchTypes, subjectNamePattern)) {
				return; // Pattern matched, validation passed
			}
		}

		// No pattern matched
		throw new PatternMatchError(branchName);
	}
}
