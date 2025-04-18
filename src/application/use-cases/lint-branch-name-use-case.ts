import type { BranchLintConfig } from "../../domain/interfaces/config.type";

import { Branch } from "../../domain/entities/branch";
import { BranchTooLongError, BranchTooShortError, PatternMatchError, ProhibitedBranchError } from "../../domain/errors/lint-errors";

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
	 * @throws {BranchTooShortError} When branch name is shorter than the minimum length
	 * @throws {BranchTooLongError} When branch name is longer than the maximum length
	 */
	public execute(branchName: string, config: BranchLintConfig): void {
		const branch: Branch = new Branch(branchName);
		const configRules = config.rules;
		const ignoreList = config.ignore ?? [];

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
	 * Validate the branch name against the pattern
	 * @param branchName The branch name to validate
	 * @param config The branch configuration
	 * @throws {PatternMatchError} When branch name doesn't match pattern
	 */
	private validatePattern(branchName: string, config: BranchLintConfig): void {
		// Start with original pattern
		let branchNamePattern: string | undefined = config.rules?.["branch-pattern"];
		const subjectNamePattern: string | undefined = config.rules?.["branch-subject-pattern"];

		if (!branchNamePattern) {
			return;
		}

		const parameters: Record<string, Array<string>> = {
			type: Object.keys(config.branches),
			// Если branch-name-pattern не определён, не добавляем name в params
			...(subjectNamePattern && { name: [subjectNamePattern] }),
		};

		// Обрабатываем параметры, если они есть
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
			branchNamePattern = branchNamePattern.replaceAll(new RegExp(placeholder, "g"), replacement);
		}

		// Create the regular expression
		const regexp: RegExp = new RegExp(`^${branchNamePattern}$`);

		// Test the branch name against the pattern
		if (!regexp.test(branchName)) {
			throw new PatternMatchError(branchName);
		}
	}
}
