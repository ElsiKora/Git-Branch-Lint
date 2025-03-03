import type { TBranchName } from "../branch-interfaces";

/**
 * Repository interface for branch operations
 */
export interface IBranchRepository {
	/**
	 * Get the current branch name
	 */
	getCurrentBranchName(): Promise<TBranchName>;
}
