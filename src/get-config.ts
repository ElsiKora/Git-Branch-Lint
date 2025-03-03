import type { PublicExplorer } from "cosmiconfig";

// eslint-disable-next-line no-duplicate-imports
import { cosmiconfig } from "cosmiconfig";

export interface IConfig {
	params: Record<string, Array<string>>;
	pattern: string;
	prohibited: Array<string>;
}

const defaultConfig: IConfig = {
	params: {
		name: ["[a-z0-9-]+"],
		type: ["fix", "docs", "misc", "improve", "introduce"],
	},
	pattern: ":type/:name",
	prohibited: ["ci", "wip", "main", "test", "build", "master", "release"],
};

export const getConfig = async (moduleName: string): Promise<IConfig> => {
	const explorer: PublicExplorer = cosmiconfig(moduleName, {
		packageProp: `elsikora.${moduleName}`,
		searchPlaces: ["package.json", `.elsikora/.${moduleName}rc`, `.elsikora/.${moduleName}rc.json`, `.elsikora/.${moduleName}rc.yaml`, `.elsikora/.${moduleName}rc.yml`, `.elsikora/.${moduleName}rc.js`, `.elsikora/.${moduleName}rc.ts`, `.elsikora/.${moduleName}rc.mjs`, `.elsikora/.${moduleName}rc.cjs`, `.elsikora/${moduleName}.config.js`, `.elsikora/${moduleName}.config.ts`, `.elsikora/${moduleName}.config.mjs`, `.elsikora/${moduleName}.config.cjs`],
	});

	const result: { config: IConfig; filepath: string; isEmpty?: boolean } | null = await explorer.search();

	return {
		...defaultConfig,
		...result?.config,
	};
};
