import type { TBranchName } from "../interfaces/branch-interfaces";

/**
 * Repository interface for branch operations
 * @deprecated Use IBranchRepository instead
 */
// eslint-disable-next-line @elsikora-typescript/naming-convention
export interface BranchRepository {
	/**
	 * Get the current branch name
	 */
	getCurrentBranchName(): Promise<TBranchName>;
}
