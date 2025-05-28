import { beforeEach, describe, expect, it, vi } from "vitest";

import { CheckWorkingDirectoryUseCase } from "../../../../src/application/use-cases/check-working-directory.use-case";
import { UncommittedChangesError } from "../../../../src/domain/errors/branch-creation.error";
import type { IBranchRepository } from "../../../../src/domain/interface/branch.repository.interface";

describe("CheckWorkingDirectoryUseCase", () => {
	let mockBranchRepository: IBranchRepository;
	let useCase: CheckWorkingDirectoryUseCase;

	beforeEach(() => {
		mockBranchRepository = {
			createBranch: vi.fn(),
			getCurrentBranchName: vi.fn(),
			hasUncommittedChanges: vi.fn(),
			pushBranch: vi.fn(),
		};
		useCase = new CheckWorkingDirectoryUseCase(mockBranchRepository);
	});

	describe("execute", () => {
		it("should not throw when there are no uncommitted changes", async () => {
			vi.mocked(mockBranchRepository.hasUncommittedChanges).mockResolvedValue(false);

			await expect(useCase.execute()).resolves.not.toThrow();
			expect(mockBranchRepository.hasUncommittedChanges).toHaveBeenCalledOnce();
		});

		it("should throw UncommittedChangesError when there are uncommitted changes", async () => {
			vi.mocked(mockBranchRepository.hasUncommittedChanges).mockResolvedValue(true);

			await expect(useCase.execute()).rejects.toThrow(UncommittedChangesError);
			expect(mockBranchRepository.hasUncommittedChanges).toHaveBeenCalledOnce();
		});

		it("should throw UncommittedChangesError with correct message", async () => {
			vi.mocked(mockBranchRepository.hasUncommittedChanges).mockResolvedValue(true);

			await expect(useCase.execute()).rejects.toThrow(
				"You have uncommitted changes. Please commit or stash them before creating a new branch."
			);
		});
	});
}); 