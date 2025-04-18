/* eslint-disable @elsikora/sonar/os-command */
/* eslint-disable @elsikora/unicorn/no-process-exit */

import { execSync } from "node:child_process";

// Функция для выполнения Git-команд
export const runGitCommand = (command: string): void => {
	try {
		execSync(command, { stdio: "inherit" });
	} catch (error) {
		console.error(`❌ Error executing command: ${command}`);
		console.error((error as Error).message);
		process.exit(1);
	}
};
