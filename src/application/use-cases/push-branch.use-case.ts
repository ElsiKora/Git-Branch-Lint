import type { IBranchRepository } from "../../domain/interface/branch.repository.interface";

/**
 * Use case for pushing a branch to remote repository
 */
export class PushBranchUseCase {
	public constructor(private readonly branchRepository: IBranchRepository) {}

	/**
	 * Execute the use case
	 * @param branchName The name of the branch to push
	 */
	public async execute(branchName: string): Promise<void> {
		await this.branchRepository.pushBranch(branchName);
	}
}
