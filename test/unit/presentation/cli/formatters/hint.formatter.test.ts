import { beforeEach, describe, expect, it } from "vitest";

import { HintFormatter } from "../../../../../src/presentation/cli/formatters/hint.formatter";
import { BranchTooLongError, BranchTooShortError, PatternMatchError, ProhibitedBranchError } from "../../../../../src/domain/errors/lint.error";
import type { IBranchLintConfig } from "../../../../../src/domain/type/config.type";

describe("HintFormatter", () => {
	let formatter: HintFormatter;
	let baseConfig: IBranchLintConfig;

	beforeEach(() => {
		formatter = new HintFormatter();
		baseConfig = {
			branches: {
				feature: { description: "New feature", title: "Feature" },
				bugfix: { description: "Bug fix", title: "Bugfix" },
				hotfix: { description: "Hot fix", title: "Hotfix" },
			},
			ignore: [],
			rules: {
				"branch-pattern": ":type/:name",
				"branch-prohibited": ["main", "master", "develop"],
			},
		};
	});

	describe("format", () => {
		describe("ProhibitedBranchError", () => {
			it("should format hint for prohibited branch error", () => {
				const error = new ProhibitedBranchError("main");
				
				const result = formatter.format(error, baseConfig);

				expect(result).toContain("Prohibited branch names:");
				expect(result).toContain("main");
				expect(result).toContain("master");
				expect(result).toContain("develop");
			});

			it("should handle empty prohibited list", () => {
				const error = new ProhibitedBranchError("main");
				const config = { ...baseConfig, rules: {} };

				const result = formatter.format(error, config);

				expect(result).toBe("Prohibited branch names: ");
			});
		});

		describe("PatternMatchError", () => {
			it("should format hint for pattern match error with object branches", () => {
				const error = new PatternMatchError("invalid-branch");

				const result = formatter.format(error, baseConfig);

				expect(result).toContain("Expected pattern:");
				expect(result).toContain(":type/:name");
				expect(result).toContain("Valid branch types:");
				expect(result).toContain("feature");
				expect(result).toContain("bugfix");
				expect(result).toContain("hotfix");
			});

			it("should format hint for pattern match error with array branches", () => {
				const error = new PatternMatchError("invalid-branch");
				const config: IBranchLintConfig = {
					branches: ["feat", "fix", "docs"],
					ignore: [],
					rules: {
						"branch-pattern": ":type/:name",
					},
				};

				const result = formatter.format(error, config);

				expect(result).toContain("Valid branch types:");
				expect(result).toContain("feat");
				expect(result).toContain("fix");
				expect(result).toContain("docs");
			});

			it("should handle missing pattern rule", () => {
				const error = new PatternMatchError("invalid-branch");
				const config = { ...baseConfig, rules: {} };

				const result = formatter.format(error, config);

				expect(result).not.toContain("Expected pattern:");
				expect(result).toContain("Valid branch types:");
			});

			it("should show pattern when branch-subject-pattern exists", () => {
				const error = new PatternMatchError("invalid-branch");
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-pattern": ":type/:name",
						"branch-subject-pattern": "[a-z0-9-]+",
					},
				};

				const result = formatter.format(error, config);

				expect(result).toContain("Expected pattern:");
				expect(result).toContain(":type/:name");
			});
		});

		describe("BranchTooLongError", () => {
			it("should return empty string for branch too long error", () => {
				const error = new BranchTooLongError("feature/very-long-branch-name", 20);

				const result = formatter.format(error, baseConfig);

				expect(result).toBe("");
			});
		});

		describe("BranchTooShortError", () => {
			it("should return empty string for branch too short error", () => {
				const error = new BranchTooShortError("fix", 5);

				const result = formatter.format(error, baseConfig);

				expect(result).toBe("");
			});
		});

		describe("Unknown errors", () => {
			it("should return empty string for unknown error types", () => {
				const error = new Error("Unknown error");

				const result = formatter.format(error, baseConfig);

				expect(result).toBe("");
			});
		});
	});
}); 