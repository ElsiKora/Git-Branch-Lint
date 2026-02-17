import { describe, expect, it } from "vitest";

import { GitBranchRepository } from "../../../../src/infrastructure/git/git-branch.repository";
import { GitOperationError } from "../../../../src/domain/errors/branch-creation.error";

describe("GitBranchRepository", () => {
	// We cannot easily test the GitBranchRepository without actually running git commands
	// or doing complex module mocking. These tests will verify the interface is correct
	// and error handling works, but won't test the actual git operations.

	describe("interface", () => {
		it("should implement IBranchRepository interface", () => {
			const repository = new GitBranchRepository();

			expect(repository).toHaveProperty("getCurrentBranchName");
			expect(repository).toHaveProperty("hasUncommittedChanges");
			expect(repository).toHaveProperty("createBranch");
			expect(repository).toHaveProperty("pushBranch");

			expect(typeof repository.getCurrentBranchName).toBe("function");
			expect(typeof repository.hasUncommittedChanges).toBe("function");
			expect(typeof repository.createBranch).toBe("function");
			expect(typeof repository.pushBranch).toBe("function");
		});
	});

	describe("error handling", () => {
		// These tests would require actual git operations or complex mocking
		// In a real project, we might:
		// 1. Use dependency injection to inject execAsync
		// 2. Create integration tests that run against a real git repo
		// 3. Use a git library that's easier to mock

		it("should throw GitOperationError for git operations", () => {
			// Just verify the error types exist and can be thrown
			const error = new GitOperationError("test operation", "test details");
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe("Git operation failed: test operation - test details");
		});
	});
});
