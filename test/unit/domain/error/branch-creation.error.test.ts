import { describe, expect, it } from "vitest";

import { BranchAlreadyExistsError, BranchCreationError, GitOperationError, UncommittedChangesError } from "../../../../src/domain/errors/branch-creation.error";

describe("Branch Creation Errors", () => {
	describe("BranchCreationError", () => {
		it("should be an instance of Error", () => {
			const error = new BranchCreationError("test error");

			expect(error).toBeInstanceOf(Error);
			expect(error.name).toBe("BranchCreationError");
			expect(error.message).toBe("test error");
		});
	});

	describe("BranchAlreadyExistsError", () => {
		it("should create error with correct message", () => {
			const branchName = "feature/existing-branch";
			const error = new BranchAlreadyExistsError(branchName);

			expect(error).toBeInstanceOf(BranchCreationError);
			expect(error.name).toBe("BranchAlreadyExistsError");
			expect(error.message).toBe(`You are already on branch ${branchName}!`);
		});
	});

	describe("GitOperationError", () => {
		it("should create error with operation only", () => {
			const operation = "checkout";
			const error = new GitOperationError(operation);

			expect(error).toBeInstanceOf(BranchCreationError);
			expect(error.name).toBe("GitOperationError");
			expect(error.message).toBe(`Git operation failed: ${operation}`);
		});

		it("should create error with operation and details", () => {
			const operation = "push";
			const details = "remote rejected";
			const error = new GitOperationError(operation, details);

			expect(error).toBeInstanceOf(BranchCreationError);
			expect(error.name).toBe("GitOperationError");
			expect(error.message).toBe(`Git operation failed: ${operation} - ${details}`);
		});
	});

	describe("UncommittedChangesError", () => {
		it("should create error with correct message", () => {
			const error = new UncommittedChangesError();

			expect(error).toBeInstanceOf(BranchCreationError);
			expect(error.name).toBe("UncommittedChangesError");
			expect(error.message).toBe("You have uncommitted changes. Please commit or stash them before creating a new branch.");
		});
	});
}); 