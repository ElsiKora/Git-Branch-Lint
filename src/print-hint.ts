import type { IConfig } from "./get-config";

import chalk from "chalk";

import * as errors from "./errors";

const gray = (message: string): string => chalk.gray.bold(message);
const white = (message: string): string => chalk.white(message);
const green = (message: string): string => chalk.greenBright(message);

export const printHint = (error: errors.LintError, config: IConfig): void => {
	const { params, pattern, prohibited }: IConfig = config;
	const parameterKeys: Array<string> = Object.keys(params);

	// eslint-disable-next-line @elsikora-typescript/switch-exhaustiveness-check
	switch (true) {
		case error === errors.branchProtectedError: {
			console.log(white("Prohibited branch names:"));
			console.log(green(`  ${prohibited.join(", ")}`));

			break;
		}

		case error === errors.branchNamePatternError: {
			console.log(gray("Branch name"));
			console.log(white("  pattern:"), green(pattern));

			if (parameterKeys.length > 0) {
				console.log(gray("Name params"));

				for (const key of parameterKeys) {
					console.log(white(`  ${key}:`), green(params[key]?.join(", ")));
				}
			}

			break;
		}
	}
	console.log("\n");
};
