import type { TBranchName } from "../../domain/interfaces/branch-interfaces";
import type { IBranchRepository } from "../../domain/interfaces/repository-interfaces";

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
	public async execute(): Promise<TBranchName> {
		return this.BRANCH_REPOSITORY.getCurrentBranchName();
	}
}
