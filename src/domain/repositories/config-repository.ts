/**
 * Repository interface for configuration operations
 * @deprecated Use IConfigRepository instead
 */

import type { BranchLintConfig } from "../interfaces/config.type";

export interface ConfigRepository {
	/**
	 * Get the branch configuration
	 * @param appName The name of the application
	 */
	getConfig(appName: string): Promise<BranchLintConfig>;
}
