import type { IBranchConfig } from "../interfaces/branch-interfaces";

/**
 * Repository interface for configuration operations
 * @deprecated Use IConfigRepository instead
 */
// eslint-disable-next-line @elsikora-typescript/naming-convention
export interface ConfigRepository {
	/**
	 * Get the branch configuration
	 * @param appName The name of the application
	 */
	getConfig(appName: string): Promise<IBranchConfig>;
}
