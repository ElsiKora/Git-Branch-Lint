import { describe, expect, it } from "vitest";

import { ValidateBranchPlaceholderValueUseCase } from "../../../../src/application/use-cases/validate-branch-placeholder-value.use-case";
import { InvalidBranchPatternConfigError } from "../../../../src/domain/errors/lint.error";

describe("ValidateBranchPlaceholderValueUseCase", () => {
	const useCase: ValidateBranchPlaceholderValueUseCase = new ValidateBranchPlaceholderValueUseCase();

	it("should pass optional placeholder when input is empty", () => {
		const result = useCase.execute({
			isOptional: true,
			patternSource: "[a-z0-9-]+",
			placeholderName: "ticket",
			value: "   ",
		});

		expect(result).toEqual({ isValid: true });
	});

	it("should pass when value matches placeholder pattern", () => {
		const result = useCase.execute({
			isOptional: false,
			patternSource: "[a-z0-9-]+",
			placeholderName: "name",
			value: "shopping-cart",
		});

		expect(result).toEqual({ isValid: true });
	});

	it("should fail when value does not match pattern", () => {
		const result = useCase.execute({
			isOptional: false,
			patternSource: "[a-z0-9-]+",
			placeholderName: "name",
			value: "Shopping Cart",
		});

		expect(result.isValid).toBe(false);
		expect(result.errorMessage).toContain("Invalid name format");
	});

	it("should pass ticket placeholder in uppercase and lowercase", () => {
		const uppercaseResult = useCase.execute({
			isOptional: false,
			patternSource: "[a-z]{2,}-[0-9]+",
			placeholderName: "ticket",
			value: "DFSF-33",
		});
		const lowercaseResult = useCase.execute({
			isOptional: false,
			patternSource: "[a-z]{2,}-[0-9]+",
			placeholderName: "ticket",
			value: "dfsf-33",
		});

		expect(uppercaseResult).toEqual({ isValid: true });
		expect(lowercaseResult).toEqual({ isValid: true });
	});

	it("should throw invalid config error for malformed regex pattern", () => {
		expect(() =>
			useCase.execute({
				isOptional: false,
				patternSource: "[a-z",
				placeholderName: "name",
				value: "abc",
			}),
		).toThrow(InvalidBranchPatternConfigError);
	});
});
