/**
 * Repository interface for branch operations
 */
export interface IBranchRepository {
	/**
	 * Create a new branch
	 * @param branchName The name of the branch to create
	 */
	createBranch(branchName: string): Promise<void>;

	/**
	 * Get the current branch name
	 */
	getCurrentBranchName(): Promise<string>;

	/**
	 * Check if working directory has uncommitted changes
	 */
	hasUncommittedChanges(): Promise<boolean>;

	/**
	 * Push branch to remote repository
	 * @param branchName The name of the branch to push
	 */
	pushBranch(branchName: string): Promise<void>;
}
