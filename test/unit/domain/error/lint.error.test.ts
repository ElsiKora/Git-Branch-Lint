import { describe, expect, it } from "vitest";

import { BranchTooLongError, BranchTooShortError, LintError, PatternMatchError, ProhibitedBranchError } from "../../../../src/domain/errors/lint.error";

describe("Lint Errors", () => {
	describe("LintError", () => {
		it("should be an instance of Error", () => {
			const error = new LintError("test error");

			expect(error).toBeInstanceOf(Error);
			expect(error.name).toBe("LintError");
			expect(error.message).toBe("test error");
		});
	});

	describe("BranchTooLongError", () => {
		it("should create error with correct message", () => {
			const branchName = "feature/very-long-branch-name";
			const maxLength = 20;
			const error = new BranchTooLongError(branchName, maxLength);

			expect(error).toBeInstanceOf(LintError);
			expect(error.name).toBe("BranchTooLongError");
			expect(error.message).toBe(`Branch name "${branchName}" is too long (maximum length: ${maxLength})`);
		});
	});

	describe("BranchTooShortError", () => {
		it("should create error with correct message", () => {
			const branchName = "fix";
			const minLength = 5;
			const error = new BranchTooShortError(branchName, minLength);

			expect(error).toBeInstanceOf(LintError);
			expect(error.name).toBe("BranchTooShortError");
			expect(error.message).toBe(`Branch name "${branchName}" is too short (minimum length: ${minLength})`);
		});
	});

	describe("PatternMatchError", () => {
		it("should create error with correct message", () => {
			const branchName = "invalid-branch";
			const error = new PatternMatchError(branchName);

			expect(error).toBeInstanceOf(LintError);
			expect(error.name).toBe("PatternMatchError");
			expect(error.message).toBe(`Branch name "${branchName}" doesn't match pattern`);
		});
	});

	describe("ProhibitedBranchError", () => {
		it("should create error with correct message", () => {
			const branchName = "main";
			const error = new ProhibitedBranchError(branchName);

			expect(error).toBeInstanceOf(LintError);
			expect(error.name).toBe("ProhibitedBranchError");
			expect(error.message).toBe(`Branch name "${branchName}" is prohibited`);
		});
	});
}); 