import { describe, expect, it } from "vitest";

import { GetBranchPatternUseCase } from "../../../../src/application/use-cases/get-branch-pattern.use-case";
import type { IBranchLintConfig } from "../../../../src/domain/type/config.type";

describe("GetBranchPatternUseCase", () => {
	const useCase: GetBranchPatternUseCase = new GetBranchPatternUseCase();

	it("should return configured branch pattern", () => {
		const config: IBranchLintConfig = {
			branches: {
				feature: { description: "Feature", title: "Feature" },
			},
			rules: {
				"branch-pattern": ":scope/:type/:name",
			},
		};

		expect(useCase.execute(config)).toBe(":scope/:type/:name");
	});

	it("should fallback to default branch pattern when missing", () => {
		const config: IBranchLintConfig = {
			branches: {
				feature: { description: "Feature", title: "Feature" },
			},
			rules: {},
		};

		expect(useCase.execute(config)).toBe(":type/:name");
	});
});
