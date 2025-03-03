import type { MatchResult, ParamData } from "path-to-regexp";

import type { IConfig } from "./get-config";

// eslint-disable-next-line no-duplicate-imports
import { match } from "path-to-regexp";

import { branchNamePatternError, branchProtectedError } from "./errors";

export const lintBranchName = (branchName: string, config: IConfig): boolean => {
	let { pattern }: IConfig = config;
	const { params, prohibited }: IConfig = config;

	if (prohibited.includes(branchName)) throw branchProtectedError;

	if (!pattern) return true;

	if (params) {
		for (const key of Object.keys(params)) {
			let values: Array<string> = params[key];

			if (!values) continue;

			if (typeof values === "string") values = [values];

			pattern = pattern.replace(`:${key}`, `:${key}(${values.join("|")})`);
		}
	}

	const branch: false | MatchResult<ParamData> = match(pattern, { decode: decodeURIComponent })(branchName);

	if (!branch) throw branchNamePatternError;

	return true;
};
