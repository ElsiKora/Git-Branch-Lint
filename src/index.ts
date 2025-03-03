import type { IConfig } from "./get-config";

import { LintError } from "./errors";
import { getBranchName } from "./get-branch-name";
// eslint-disable-next-line no-duplicate-imports
import { getConfig } from "./get-config";
import { lintBranchName } from "./lint-branch-name";
import { printError } from "./print-error";
import { printHint } from "./print-hint";

const APP_NAME: string = "git-branch-lint";

const main = async (): Promise<void> => {
	const [config, branchName]: [IConfig, string] = await Promise.all([getConfig(APP_NAME), getBranchName()]);

	try {
		lintBranchName(branchName, config);
	} catch (error: unknown) {
		if (!(error instanceof LintError)) throw error;

		printError(error.message);
		printHint(error, config);
		// eslint-disable-next-line @elsikora-unicorn/no-process-exit,elsikora-node/no-process-exit
		process.exit(1);
	}
};

main().catch((error: unknown) => {
	printError("[LintBranchName] Unhandled error occurred");

	throw error;
});
