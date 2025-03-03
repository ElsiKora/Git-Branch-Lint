import type { IBranchConfig } from "../branch-interfaces";

/**
 * Repository interface for configuration operations
 */
export interface IConfigRepository {
	/**
	 * Get the branch configuration
	 * @param appName The name of the application
	 */
	getConfig(appName: string): Promise<IBranchConfig>;
}
