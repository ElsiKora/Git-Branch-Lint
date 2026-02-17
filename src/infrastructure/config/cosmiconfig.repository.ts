import type { CosmiconfigResult } from "cosmiconfig";

import type { IConfigRepository } from "../../domain/interface/config.repository.interface";
import type { IBranchLintConfig } from "../../domain/type/config.type";

import { cosmiconfig } from "cosmiconfig";

import { DEFAULT_BRANCH_LINT_CONFIG } from "../../domain/config/default-branch-lint-config";

/**
 * Cosmiconfig implementation of ConfigRepository
 */
export class CosmiconfigRepository implements IConfigRepository {
	/**
	 * Get the branch configuration
	 * @param appName The name of the application
	 * @returns A promise that resolves to the branch configuration
	 */
	public async getConfig(appName: string): Promise<IBranchLintConfig> {
		const configExplorer: ReturnType<typeof cosmiconfig> = cosmiconfig(appName, {
			packageProp: `elsikora.${appName}`,
			searchPlaces: ["package.json", `.elsikora/.${appName}rc`, `.elsikora/.${appName}rc.json`, `.elsikora/.${appName}rc.yaml`, `.elsikora/.${appName}rc.yml`, `.elsikora/.${appName}rc.js`, `.elsikora/.${appName}rc.ts`, `.elsikora/.${appName}rc.mjs`, `.elsikora/.${appName}rc.cjs`, `.elsikora/${appName}.config.js`, `.elsikora/${appName}.config.ts`, `.elsikora/${appName}.config.mjs`, `.elsikora/${appName}.config.cjs`],
		});
		const result: CosmiconfigResult = await configExplorer.search();

		if (!result || result.isEmpty) {
			return DEFAULT_BRANCH_LINT_CONFIG;
		}

		// Convert the config to match our interfaces
		const providedConfig: IBranchLintConfig = result.config as IBranchLintConfig;

		const mergedConfig: IBranchLintConfig = {
			...DEFAULT_BRANCH_LINT_CONFIG,
			...providedConfig,
			branches: providedConfig.branches ?? DEFAULT_BRANCH_LINT_CONFIG.branches,
			ignore: providedConfig.ignore ?? DEFAULT_BRANCH_LINT_CONFIG.ignore,
			rules: {
				...DEFAULT_BRANCH_LINT_CONFIG.rules,
				...providedConfig.rules,
			},
		};

		return mergedConfig;
	}
}
