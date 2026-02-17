import type { TBranchSubjectPattern } from "../../domain/type/branch-subject-pattern.type";
import type { IBranchLintConfig } from "../../domain/type/config.type";

import { Branch } from "../../domain/entity/branch.entity";
import { BranchTooLongError, BranchTooShortError, PatternMatchError, ProhibitedBranchError } from "../../domain/errors/lint.error";
import { BranchTemplatePolicy } from "../../domain/policy/branch-template.policy";

/**
 * Use case for linting branch names
 */
export class LintBranchNameUseCase {
	private readonly BRANCH_TEMPLATE_POLICY: BranchTemplatePolicy;

	public constructor(branchTemplatePolicy: BranchTemplatePolicy = new BranchTemplatePolicy()) {
		this.BRANCH_TEMPLATE_POLICY = branchTemplatePolicy;
	}

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
	 * Validate the branch name against the pattern
	 * @param branchName The branch name to validate
	 * @param config The branch configuration
	 * @throws {PatternMatchError} When branch name doesn't match pattern
	 */
	private validatePattern(branchName: string, config: IBranchLintConfig): void {
		// Start with original pattern
		const branchNamePattern: string | undefined = config.rules?.["branch-pattern"];
		const subjectPattern: TBranchSubjectPattern | undefined = config.rules?.["branch-subject-pattern"];

		if (!branchNamePattern) {
			return;
		}

		const branchTypes: Array<string> = Array.isArray(config.branches) ? config.branches : Object.keys(config.branches);
		const placeholders: Array<string> = this.BRANCH_TEMPLATE_POLICY.getPlaceholders(branchNamePattern);
		const patternVariants: Array<string> = this.BRANCH_TEMPLATE_POLICY.buildValidationPatterns(branchNamePattern);

		for (const patternVariant of patternVariants) {
			let resolvedPattern: string = patternVariant;

			for (const placeholder of placeholders) {
				const placeholderToken: string = `:${placeholder}`;

				if (!resolvedPattern.includes(placeholderToken)) {
					continue;
				}

				const patternSource: string = this.BRANCH_TEMPLATE_POLICY.resolvePlaceholderPatternSource(placeholder, branchTypes, subjectPattern);
				resolvedPattern = resolvedPattern.replaceAll(placeholderToken, `(${patternSource})`);
			}

			const expression: RegExp = new RegExp(`^${resolvedPattern}$`);

			if (expression.test(branchName)) {
				return;
			}
		}

		throw new PatternMatchError(branchName);
	}
}
