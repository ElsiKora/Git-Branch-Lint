import { describe, expect, it } from "vitest";

import { GetBranchPlaceholderDefinitionsUseCase } from "../../../../src/application/use-cases/get-branch-placeholder-definitions.use-case";
import type { IBranchLintConfig } from "../../../../src/domain/type/config.type";

describe("GetBranchPlaceholderDefinitionsUseCase", () => {
	const useCase: GetBranchPlaceholderDefinitionsUseCase = new GetBranchPlaceholderDefinitionsUseCase();

	it("should return placeholder definitions for optional ticket pattern", () => {
		const config: IBranchLintConfig = {
			branches: {
				feature: { description: "Feature", title: "Feature" },
			},
			rules: {
				"branch-pattern": ":type/:ticket-:name",
				"branch-subject-pattern": "[a-z0-9-]+",
			},
		};

		const definitions = useCase.execute({ config });

		expect(definitions).toEqual([
			{
				isOptional: false,
				isTypePlaceholder: true,
				placeholderName: "type",
			},
			{
				example: "PROJ-123",
				isOptional: true,
				isTypePlaceholder: false,
				patternSource: "[a-z]{2,}-[0-9]+",
				placeholderName: "ticket",
			},
			{
				isOptional: false,
				isTypePlaceholder: false,
				patternSource: "[a-z0-9-]+",
				placeholderName: "name",
			},
		]);
	});

	it("should use object subject pattern for custom placeholders", () => {
		const config: IBranchLintConfig = {
			branches: {
				feat: { description: "Feature", title: "Feature" },
				fix: { description: "Fix", title: "Fix" },
			},
			rules: {
				"branch-pattern": ":scope/:type/:description",
				"branch-subject-pattern": {
					description: "[a-z0-9-]+",
					scope: "(web|api|shared)",
				},
			},
		};

		const definitions = useCase.execute({ config });

		expect(definitions).toEqual([
			{
				isOptional: false,
				isTypePlaceholder: false,
				patternSource: "(web|api|shared)",
				placeholderName: "scope",
			},
			{
				isOptional: false,
				isTypePlaceholder: true,
				placeholderName: "type",
			},
			{
				isOptional: false,
				isTypePlaceholder: false,
				patternSource: "[a-z0-9-]+",
				placeholderName: "description",
			},
		]);
	});
});
