import type { IBranchConfig } from "../../domain/interfaces/branch-interfaces";
import type { IConfigRepository } from "../../domain/interfaces/repository-interfaces";

import { cosmiconfig, type CosmiconfigResult } from "cosmiconfig";

/**
 * Default configuration for branch linting
 */
const DEFAULT_CONFIG: IBranchConfig = {
	// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
	MAXLENGTH: 50,
	// eslint-disable-next-line @elsikora-typescript/no-magic-numbers
	MINLENGTH: 5,
	PARAMS: {
		NAME: ["[a-z0-9-]+"],
		TYPE: ["feature", "hotfix", "support", "bugfix", "release"],
	},
	PATTERN: ":type/:name",
	PROHIBITED: ["ci", "wip", "main", "test", "build", "master", "release", "dev", "develop"],
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
	public async getConfig(appName: string): Promise<IBranchConfig> {
		const configExplorer: ReturnType<typeof cosmiconfig> = cosmiconfig(appName, {
			packageProp: `elsikora.${appName}`,
			searchPlaces: ["package.json", `.elsikora/.${appName}rc`, `.elsikora/.${appName}rc.json`, `.elsikora/.${appName}rc.yaml`, `.elsikora/.${appName}rc.yml`, `.elsikora/.${appName}rc.js`, `.elsikora/.${appName}rc.ts`, `.elsikora/.${appName}rc.mjs`, `.elsikora/.${appName}rc.cjs`, `.elsikora/${appName}.config.js`, `.elsikora/${appName}.config.ts`, `.elsikora/${appName}.config.mjs`, `.elsikora/${appName}.config.cjs`],
		});
		const result: CosmiconfigResult = await configExplorer.search();

		if (!result || result.isEmpty) {
			return DEFAULT_CONFIG;
		}

		// Convert the config to match our interfaces
		const providedConfig: Record<string, unknown> = result.config as Record<string, unknown>;
		const uppercasedConfig: Record<string, unknown> = {};

		// Create a new object with uppercase keys instead of modifying the original
		for (const key of Object.keys(providedConfig)) {
			const uppercaseKey: string = key.toUpperCase();
			const value: unknown = providedConfig[key];

			if (Array.isArray(value)) {
				// Preserve arrays
				// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
				uppercasedConfig[uppercaseKey] = [...value];
			} else if (typeof value === "object" && value !== null) {
				// Handle nested objects
				const nestedObject: Record<string, unknown> = {};

				for (const subKey of Object.keys(value as Record<string, unknown>)) {
					const subValue: unknown = (value as Record<string, unknown>)[subKey];

					if (Array.isArray(subValue)) {
						// Preserve nested arrays
						// eslint-disable-next-line @elsikora-typescript/no-unsafe-assignment
						nestedObject[subKey.toUpperCase()] = [...subValue];
					} else {
						nestedObject[subKey.toUpperCase()] = subValue;
					}
				}
				uppercasedConfig[uppercaseKey] = nestedObject;
			} else {
				// Handle primitive values
				uppercasedConfig[uppercaseKey] = value;
			}
		}

		const mergedConfig: IBranchConfig = {
			...DEFAULT_CONFIG,
			...(uppercasedConfig as unknown as IBranchConfig),
		};

		if (uppercasedConfig.PARAMS && DEFAULT_CONFIG.PARAMS) {
			mergedConfig.PARAMS = {
				...DEFAULT_CONFIG.PARAMS,
				...(uppercasedConfig.PARAMS as Record<string, unknown>),
			};
		}

		return mergedConfig;
	}
}
