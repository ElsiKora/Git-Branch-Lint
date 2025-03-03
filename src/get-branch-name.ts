import type { ExecException } from "node:child_process";

// eslint-disable-next-line no-duplicate-imports
import { exec } from "node:child_process";

export const getBranchName = (): Promise<string> =>
	new Promise((resolve: (value: PromiseLike<string> | string) => void, reject: (reason?: any) => void) => {
		// eslint-disable-next-line @elsikora-sonar/no-os-command-from-path
		exec("git rev-parse --abbrev-ref HEAD", (error: ExecException | null, stdout: string) => {
			// eslint-disable-next-line @elsikora-typescript/no-unused-expressions
			error ? reject(error) : resolve(stdout.trim());
		});
	});
