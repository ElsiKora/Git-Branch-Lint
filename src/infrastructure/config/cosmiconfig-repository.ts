/* eslint-disable @elsikora/typescript/no-magic-numbers */
import type { BranchLintConfig } from "../../domain/interfaces/config.type";
import type { IConfigRepository } from "../../domain/interfaces/repository-interfaces";

import { cosmiconfig, type CosmiconfigResult } from "cosmiconfig";

/**
 * Default configuration for branch linting
 */
export const DEFAULT_CONFIG: BranchLintConfig = {
	branches: {
		bugfix: { description: "🐞 Fixing issues in existing functionality", title: "Bugfix" },
		feature: { description: "🆕 Integration of new functionality", title: "Feature" },
		hotfix: { description: "🚑 Critical fixes for urgent issues", title: "Hotfix" },
		release: { description: "📦 Preparing a new release version", title: "Release" },
		support: { description: "🛠️ Support and maintenance tasks", title: "Support" },
	},
	ignore: ["dev"],
	rules: {
		"branch-max-length": 50,
		"branch-min-length": 5,
		"branch-pattern": ":type/:name",
		"branch-prohibited": ["main", "master", "release"],
		"branch-subject-pattern": "[a-z0-9-]+",
	},
};

/**
 * Cosmiconfig implementation of ConfigRepository
 */
export class CosmiconfigRepository implements IConfigRepository {
	/**
	 * Get the branch configuration
	 * @param appName The name of the application
	 * @returns A promise that resolves to the branch configuration
	 */
	public async getConfig(appName: string): Promise<BranchLintConfig> {
		const configExplorer: ReturnType<typeof cosmiconfig> = cosmiconfig(appName, {
			packageProp: `elsikora.${appName}`,
			searchPlaces: ["package.json", `.elsikora/.${appName}rc`, `.elsikora/.${appName}rc.json`, `.elsikora/.${appName}rc.yaml`, `.elsikora/.${appName}rc.yml`, `.elsikora/.${appName}rc.js`, `.elsikora/.${appName}rc.ts`, `.elsikora/.${appName}rc.mjs`, `.elsikora/.${appName}rc.cjs`, `.elsikora/${appName}.config.js`, `.elsikora/${appName}.config.ts`, `.elsikora/${appName}.config.mjs`, `.elsikora/${appName}.config.cjs`],
		});
		const result: CosmiconfigResult = await configExplorer.search();

		if (!result || result.isEmpty) {
			return DEFAULT_CONFIG;
		}

		// Convert the config to match our interfaces
		const providedConfig: BranchLintConfig = result.config as BranchLintConfig;

		const mergedConfig: BranchLintConfig = {
			...DEFAULT_CONFIG,
			...providedConfig,
		};

		return mergedConfig;
	}
}
