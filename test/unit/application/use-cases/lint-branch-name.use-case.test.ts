import { beforeEach, describe, expect, it } from "vitest";

import { LintBranchNameUseCase } from "../../../../src/application/use-cases/lint-branch-name.use-case";
import { BranchTooLongError, BranchTooShortError, PatternMatchError, ProhibitedBranchError } from "../../../../src/domain/errors/lint.error";
import type { IBranchLintConfig } from "../../../../src/domain/type/config.type";

describe("LintBranchNameUseCase", () => {
	let useCase: LintBranchNameUseCase;
	let baseConfig: IBranchLintConfig;

	beforeEach(() => {
		useCase = new LintBranchNameUseCase();
		baseConfig = {
			branches: {
				feature: { description: "New feature", title: "Feature" },
				bugfix: { description: "Bug fix", title: "Bugfix" },
				hotfix: { description: "Hot fix", title: "Hotfix" },
			},
			ignore: [],
			rules: {},
		};
	});

	describe("execute", () => {
		describe("ignored branches", () => {
			it("should not throw for ignored branch names", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					ignore: ["dev", "test"],
					rules: {
						"branch-pattern": ":type/:name",
					},
				};

				expect(() => useCase.execute("dev", config)).not.toThrow();
				expect(() => useCase.execute("test", config)).not.toThrow();
			});
		});

		describe("prohibited branches", () => {
			it("should throw ProhibitedBranchError for prohibited branch names", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-prohibited": ["main", "master", "develop"],
					},
				};

				expect(() => useCase.execute("main", config)).toThrow(ProhibitedBranchError);
				expect(() => useCase.execute("master", config)).toThrow(ProhibitedBranchError);
				expect(() => useCase.execute("develop", config)).toThrow(ProhibitedBranchError);
			});

			it("should not throw for non-prohibited branch names", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-prohibited": ["main", "master"],
					},
				};

				expect(() => useCase.execute("feature/test", config)).not.toThrow();
			});
		});

		describe("branch length validation", () => {
			it("should throw BranchTooShortError when branch is too short", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-min-length": 5,
					},
				};

				expect(() => useCase.execute("dev", config)).toThrow(BranchTooShortError);
			});

			it("should throw BranchTooLongError when branch is too long", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-max-length": 10,
					},
				};

				expect(() => useCase.execute("feature/very-long-branch-name", config)).toThrow(BranchTooLongError);
			});

			it("should not throw when branch length is within limits", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-min-length": 5,
						"branch-max-length": 20,
					},
				};

				expect(() => useCase.execute("feature/test", config)).not.toThrow();
			});
		});

		describe("pattern validation", () => {
			it("should throw PatternMatchError when branch doesn't match pattern", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-pattern": ":type/:name",
					},
				};

				expect(() => useCase.execute("invalid-branch", config)).toThrow(PatternMatchError);
			});

			it("should not throw when branch matches pattern", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-pattern": ":type/:name",
						"branch-subject-pattern": "[a-z-]+",
					},
				};

				expect(() => useCase.execute("feature/new-feature", config)).not.toThrow();
				expect(() => useCase.execute("bugfix/fix-issue", config)).not.toThrow();
			});

			it("should handle branch-subject-pattern", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-pattern": ":type/:name",
						"branch-subject-pattern": "[a-z0-9-]+",
					},
				};

				expect(() => useCase.execute("feature/valid-name-123", config)).not.toThrow();
			});

			it("should support optional ticket id in branch pattern", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-pattern": ":type/:ticket-:name",
						"branch-subject-pattern": "[a-z0-9-]+",
					},
				};

				expect(() => useCase.execute("feature/proj-123-my-feature", config)).not.toThrow();
				expect(() => useCase.execute("feature/my-feature", config)).not.toThrow();
			});

			it("should reject uppercase ticket id when ticket placeholder is used", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-pattern": ":type/:ticket-:name",
						"branch-subject-pattern": "[a-z0-9-]+",
					},
				};

				expect(() => useCase.execute("feature/PROJ-123-my-feature", config)).toThrow(PatternMatchError);
			});

			it("should escape special regex characters in branch types", () => {
				const config: IBranchLintConfig = {
					branches: {
						"feature+": { description: "Feature plus", title: "Feature+" },
					},
					ignore: [],
					rules: {
						"branch-pattern": ":type/:name",
						"branch-subject-pattern": "[a-z-]+",
					},
				};

				expect(() => useCase.execute("feature+/test", config)).not.toThrow();
			});

			it("should handle pattern with square brackets", () => {
				const config: IBranchLintConfig = {
					branches: {
						"[feature]": { description: "Feature", title: "[Feature]" },
						"[bugfix]": { description: "Bugfix", title: "[Bugfix]" },
					},
					ignore: [],
					rules: {
						"branch-pattern": ":type/:name",
						"branch-subject-pattern": "[a-z-]+",
					},
				};

				expect(() => useCase.execute("[feature]/test", config)).not.toThrow();
			});

			it("should support custom placeholders with object subject patterns", () => {
				const config: IBranchLintConfig = {
					branches: {
						feat: { description: "Feature", title: "Feature" },
						fix: { description: "Fix", title: "Fix" },
					},
					ignore: [],
					rules: {
						"branch-pattern": ":scope/:type/:description",
						"branch-subject-pattern": {
							description: "[a-z0-9-]+",
							scope: "(web|api|shared)",
						},
					},
				};

				expect(() => useCase.execute("web/feat/new-ui", config)).not.toThrow();
				expect(() => useCase.execute("mobile/feat/new-ui", config)).toThrow(PatternMatchError);
			});
		});

		describe("execution order", () => {
			it("should check prohibited before pattern", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {
						"branch-prohibited": ["main"],
						"branch-pattern": ":type/:name",
					},
				};

				expect(() => useCase.execute("main", config)).toThrow(ProhibitedBranchError);
			});

			it("should check ignored before any validation", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					ignore: ["invalid"],
					rules: {
						"branch-pattern": ":type/:name",
						"branch-min-length": 10,
					},
				};

				expect(() => useCase.execute("invalid", config)).not.toThrow();
			});
		});

		describe("edge cases", () => {
			it("should handle empty rules", () => {
				const config: IBranchLintConfig = {
					...baseConfig,
					rules: {},
				};

				expect(() => useCase.execute("any-branch-name", config)).not.toThrow();
			});

			it("should handle undefined rules", () => {
				const config: IBranchLintConfig = {
					branches: baseConfig.branches,
					ignore: [],
				};

				expect(() => useCase.execute("any-branch-name", config)).not.toThrow();
			});

			it("should handle array branches configuration", () => {
				const config: IBranchLintConfig = {
					branches: ["feature", "bugfix", "hotfix"],
					ignore: [],
					rules: {
						"branch-pattern": ":type/:name",
					},
				};

				expect(() => useCase.execute("feature/test", config)).not.toThrow();
			});
		});
	});
});
