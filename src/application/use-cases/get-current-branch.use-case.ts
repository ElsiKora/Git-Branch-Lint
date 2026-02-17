import type { IBranchRepository } from "../../domain/interface/branch.repository.interface";

/**
 * Use case for getting the current branch name
 */
export class GetCurrentBranchUseCase {
	public constructor(private readonly branchRepository: IBranchRepository) {}

	/**
	 * Execute the use case
	 * @returns The current branch name
	 */
	public async execute(): Promise<string> {
		return this.branchRepository.getCurrentBranchName();
	}
}
