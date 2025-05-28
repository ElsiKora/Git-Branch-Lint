import { beforeEach, describe, expect, it, vi } from "vitest";

import { CreateBranchUseCase } from "../../../../src/application/use-cases/create-branch.use-case";
import type { IBranchRepository } from "../../../../src/domain/interface/branch.repository.interface";

describe("CreateBranchUseCase", () => {
	let mockBranchRepository: IBranchRepository;
	let useCase: CreateBranchUseCase;

	beforeEach(() => {
		mockBranchRepository = {
			createBranch: vi.fn(),
			getCurrentBranchName: vi.fn(),
			hasUncommittedChanges: vi.fn(),
			pushBranch: vi.fn(),
		};
		useCase = new CreateBranchUseCase(mockBranchRepository);
	});

	describe("execute", () => {
		it("should create a branch successfully", async () => {
			const branchName = "feature/new-feature";
			vi.mocked(mockBranchRepository.createBranch).mockResolvedValue(undefined);

			await useCase.execute(branchName);

			expect(mockBranchRepository.createBranch).toHaveBeenCalledOnce();
			expect(mockBranchRepository.createBranch).toHaveBeenCalledWith(branchName);
		});

		it("should propagate errors from repository", async () => {
			const branchName = "feature/new-feature";
			const error = new Error("Failed to create branch");
			vi.mocked(mockBranchRepository.createBranch).mockRejectedValue(error);

			await expect(useCase.execute(branchName)).rejects.toThrow("Failed to create branch");
		});
	});
}); 