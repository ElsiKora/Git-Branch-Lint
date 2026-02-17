import type { TBranchSubjectPattern } from "../type/branch-subject-pattern.type";

import { DEFAULT_BRANCH_SUBJECT_PATTERN_SOURCE } from "../constant/branch-pattern.constant";
import { TICKET_ID_PATTERN_SOURCE } from "../constant/ticket-id.constant";

const OPTIONAL_PLACEHOLDER_SUFFIXES: ReadonlyArray<string> = ["-"];

/**
 * Domain policy for working with branch templates and placeholders.
 */
export class BranchTemplatePolicy {
	private static readonly PLACEHOLDER_PATTERN: RegExp = /:([a-z](?:[a-z0-9-]*[a-z0-9])?)/gi;

	public buildBranchName(branchPattern: string, placeholderValues: Record<string, string>): string {
		let resolvedBranchName: string = branchPattern;

		for (const placeholderName of this.getPlaceholders(branchPattern)) {
			const placeholderToken: string = `:${placeholderName}`;
			const rawValue: string = placeholderValues[placeholderName] ?? "";
			const normalizedValue: string = rawValue.trim();

			if (normalizedValue.length === 0 && this.isPlaceholderOptional(branchPattern, placeholderName)) {
				resolvedBranchName = this.removeOptionalPlaceholder(resolvedBranchName, placeholderName);
				continue;
			}

			resolvedBranchName = resolvedBranchName.replaceAll(placeholderToken, normalizedValue);
		}

		return this.normalizeBranchNameDelimiters(resolvedBranchName);
	}

	public buildValidationPatterns(branchPattern: string): Array<string> {
		let patternVariants: Array<string> = [branchPattern];

		for (const placeholderName of this.getPlaceholders(branchPattern)) {
			if (!this.isPlaceholderOptional(branchPattern, placeholderName)) {
				continue;
			}

			patternVariants = patternVariants.flatMap((variant: string) => [variant, this.removeOptionalPlaceholder(variant, placeholderName)]);
		}

		return [...new Set(patternVariants.map((variant: string) => this.normalizeBranchNameDelimiters(variant)).filter((variant: string) => variant.length > 0))];
	}

	public getPlaceholders(branchPattern: string): Array<string> {
		const matches: IterableIterator<RegExpMatchArray> = branchPattern.matchAll(BranchTemplatePolicy.PLACEHOLDER_PATTERN);
		const orderedPlaceholders: Array<string> = [];

		for (const match of matches) {
			const placeholderName: string = match[1];

			if (!orderedPlaceholders.includes(placeholderName)) {
				orderedPlaceholders.push(placeholderName);
			}
		}

		return orderedPlaceholders;
	}

	public isPlaceholderOptional(branchPattern: string, placeholderName: string): boolean {
		const placeholderToken: string = `:${placeholderName}`;

		return OPTIONAL_PLACEHOLDER_SUFFIXES.some((suffix: string) => branchPattern.includes(`${placeholderToken}${suffix}`));
	}

	public resolvePlaceholderPatternSource(placeholderName: string, branchTypes: Array<string>, subjectPattern?: TBranchSubjectPattern): string {
		if (placeholderName === "type") {
			return this.createAlternationPattern(branchTypes);
		}

		if (typeof subjectPattern === "object" && subjectPattern?.[placeholderName]) {
			return subjectPattern[placeholderName];
		}

		if (placeholderName === "ticket") {
			return TICKET_ID_PATTERN_SOURCE;
		}

		if (typeof subjectPattern === "string") {
			return subjectPattern;
		}

		return DEFAULT_BRANCH_SUBJECT_PATTERN_SOURCE;
	}

	private createAlternationPattern(branchTypes: Array<string>): string {
		if (branchTypes.length === 0) {
			return DEFAULT_BRANCH_SUBJECT_PATTERN_SOURCE;
		}

		return branchTypes.map((branchType: string) => this.escapeRegex(branchType)).join("|");
	}

	private escapeRegex(value: string): string {
		return value.replaceAll(/[\\^$.*+?()[\]{}|/-]/g, String.raw`\$&`);
	}

	private isDelimiter(character: string): boolean {
		return character === "." || character === "-" || character === "/" || character === "_";
	}

	private normalizeBranchNameDelimiters(branchName: string): string {
		const compactedBranchName: string = branchName
			.replaceAll(/\/{2,}/g, "/")
			.replaceAll(/-{2,}/g, "-")
			.replaceAll(/_{2,}/g, "_")
			.replaceAll(/\.{2,}/g, ".");

		return this.trimDelimiterEdges(compactedBranchName);
	}

	private removeOptionalPlaceholder(branchPattern: string, placeholderName: string): string {
		const placeholderToken: string = `:${placeholderName}`;
		let updatedPattern: string = branchPattern;

		for (const suffix of OPTIONAL_PLACEHOLDER_SUFFIXES) {
			updatedPattern = updatedPattern.replaceAll(`${placeholderToken}${suffix}`, "");
		}

		updatedPattern = updatedPattern.replaceAll(placeholderToken, "");

		return updatedPattern;
	}

	private trimDelimiterEdges(value: string): string {
		let startIndex: number = 0;
		let endIndex: number = value.length - 1;

		while (startIndex <= endIndex && this.isDelimiter(value[startIndex])) {
			startIndex++;
		}

		while (endIndex >= startIndex && this.isDelimiter(value[endIndex])) {
			endIndex--;
		}

		return value.slice(startIndex, endIndex + 1);
	}
}
