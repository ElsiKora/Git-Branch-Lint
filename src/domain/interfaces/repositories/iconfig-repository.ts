import type { BranchLintConfig } from "../config.type";

/**
 * Repository interface for configuration operations
 */
export interface IConfigRepository {
	/**
	 * Get the branch configuration
	 * @param appName The name of the application
	 */
	getConfig(appName: string): Promise<BranchLintConfig>;
}
