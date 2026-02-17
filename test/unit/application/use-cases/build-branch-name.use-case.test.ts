import { describe, expect, it } from "vitest";

import { BuildBranchNameUseCase } from "../../../../src/application/use-cases/build-branch-name.use-case";

describe("BuildBranchNameUseCase", () => {
	const useCase: BuildBranchNameUseCase = new BuildBranchNameUseCase();

	it("should build branch name with optional ticket placeholder", () => {
		const branchName: string = useCase.execute({
			branchPattern: ":type/:ticket-:name",
			placeholderValues: {
				name: "user-authentication",
				ticket: "proj-123",
				type: "feature",
			},
		});

		expect(branchName).toBe("feature/proj-123-user-authentication");
	});

	it("should build branch name when optional placeholder is omitted", () => {
		const branchName: string = useCase.execute({
			branchPattern: ":type/:ticket-:name",
			placeholderValues: {
				name: "user-authentication",
				ticket: "",
				type: "feature",
			},
		});

		expect(branchName).toBe("feature/user-authentication");
	});

	it("should build branch name for custom template placeholders", () => {
		const branchName: string = useCase.execute({
			branchPattern: ":scope/:type/:name",
			placeholderValues: {
				name: "shopping-cart",
				scope: "web",
				type: "feat",
			},
		});

		expect(branchName).toBe("web/feat/shopping-cart");
	});
});
