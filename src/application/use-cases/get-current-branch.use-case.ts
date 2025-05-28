import type { IBranchRepository } from "../../domain/interface/branch.repository.interface";

/**
 * Use case for getting the current branch name
 */
export class GetCurrentBranchUseCase {
	private readonly BRANCH_REPOSITORY: IBranchRepository;

	/**
	 * Constructor
	 * @param branchRepository The branch repository
	 */
	constructor(branchRepository: IBranchRepository) {
		this.BRANCH_REPOSITORY = branchRepository;
	}

	/**
	 * Execute the use case
	 * @returns The current branch name
	 */
	public async execute(): Promise<string> {
		return this.BRANCH_REPOSITORY.getCurrentBranchName();
	}
}
