/**
 * Repository interface for branch operations
 * @deprecated Use IBranchRepository instead
 */

export interface BranchRepository {
	/**
	 * Get the current branch name
	 */
	getCurrentBranchName(): Promise<string>;
}
