/**
 * Repository interface for configuration operations
 */

import type { IBranchLintConfig } from "../type/config.type";

export interface IConfigRepository {
	/**
	 * Get the branch configuration
	 * @param appName The name of the application
	 */
	getConfig(appName: string): Promise<IBranchLintConfig>;
}
