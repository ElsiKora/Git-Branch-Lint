import { beforeEach, describe, expect, it } from "vitest";

import { ValidateBranchNameUseCase } from "../../../../src/application/use-cases/validate-branch-name.use-case";

describe("ValidateBranchNameUseCase", () => {
	let useCase: ValidateBranchNameUseCase;

	beforeEach(() => {
		useCase = new ValidateBranchNameUseCase();
	});

	describe("execute", () => {
		it("should return invalid when branch name is empty", () => {
			const result = useCase.execute("");

			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe("Branch name cannot be empty!");
		});

		it("should return invalid when branch name contains only whitespace", () => {
			const result = useCase.execute("   ");

			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe("Branch name cannot be empty!");
		});

		it("should return invalid when branch name contains uppercase letters", () => {
			const result = useCase.execute("Feature-Branch");

			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe("Branch name can only contain lowercase letters, numbers, and hyphens!");
		});

		it("should return invalid when branch name contains special characters", () => {
			const result = useCase.execute("feature/branch");

			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe("Branch name can only contain lowercase letters, numbers, and hyphens!");
		});

		it("should return invalid when branch name contains spaces", () => {
			const result = useCase.execute("feature branch");

			expect(result.isValid).toBe(false);
			expect(result.errorMessage).toBe("Branch name can only contain lowercase letters, numbers, and hyphens!");
		});

		it("should return valid for lowercase letters only", () => {
			const result = useCase.execute("feature");

			expect(result.isValid).toBe(true);
			expect(result.errorMessage).toBeUndefined();
		});

		it("should return valid for lowercase letters with hyphens", () => {
			const result = useCase.execute("feature-branch");

			expect(result.isValid).toBe(true);
			expect(result.errorMessage).toBeUndefined();
		});

		it("should return valid for lowercase letters with numbers", () => {
			const result = useCase.execute("feature-123");

			expect(result.isValid).toBe(true);
			expect(result.errorMessage).toBeUndefined();
		});

		it("should return valid for numbers only", () => {
			const result = useCase.execute("123");

			expect(result.isValid).toBe(true);
			expect(result.errorMessage).toBeUndefined();
		});

		it("should return valid for complex valid names", () => {
			const result = useCase.execute("feature-123-test-branch");

			expect(result.isValid).toBe(true);
			expect(result.errorMessage).toBeUndefined();
		});
	});
}); 