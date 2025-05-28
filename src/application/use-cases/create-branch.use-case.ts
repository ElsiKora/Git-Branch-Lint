import type { IBranchRepository } from "../../domain/interface/branch.repository.interface";

import { BranchAlreadyExistsError } from "../../domain/errors/branch-creation.error";

/**
 * Use case for creating a new branch
 */
export class CreateBranchUseCase {
	public constructor(private readonly branchRepository: IBranchRepository) {}

	/**
	 * Execute the use case
	 * @param branchName The name of the branch to create
	 * @throws {BranchAlreadyExistsError} When trying to create current branch
	 */
	public async execute(branchName: string): Promise<void> {
		const currentBranch: string = await this.branchRepository.getCurrentBranchName();

		if (currentBranch === branchName) {
			throw new BranchAlreadyExistsError(branchName);
		}

		await this.branchRepository.createBranch(branchName);
	}
}
