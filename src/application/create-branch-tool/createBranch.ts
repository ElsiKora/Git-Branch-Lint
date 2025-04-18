/* eslint-disable @elsikora/sonar/no-os-command-from-path */

/* eslint-disable @elsikora/unicorn/no-process-exit */
/* eslint-disable @elsikora/node/no-extraneous-import */

import { execSync } from "node:child_process";

import inquirer from "inquirer";

import { CosmiconfigRepository } from "../../infrastructure/config/cosmiconfig-repository";

import { branchNameQuiz } from "./utils/branchNameQuiz";
import { runGitCommand } from "./utils/runGitCommand";

// Основная функция для создания ветки
export const createBranch = async (appName: string): Promise<void> => {
	const configRepository: CosmiconfigRepository = new CosmiconfigRepository();

	const { branches } = await configRepository.getConfig(appName);
	// Проверка чистоты рабочей директории (есть ли незакомиченные файлы)
	const status: string = execSync("git status --porcelain", { encoding: "utf8" });

	if (status) {
		console.log("⚠️ You have uncommitted changes. Please commit or stash them before creating a new branch.");
		process.exit(1);
	}
	//

	console.log("🌿 Creating a new branch...\n");

	const branchName: string = await branchNameQuiz(branches);

	// Проверка, не создается ли дубликат
	const currentBranch: string = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf8" }).trim();

	if (currentBranch === branchName) {
		console.log(`⚠️ You are already on branch ${branchName}!`);
		process.exit(0);
	}

	runGitCommand(`git checkout -b ${branchName}`);

	const { shouldPush }: { shouldPush: boolean } = await inquirer.prompt<{ shouldPush: boolean }>([
		{
			default: false,
			message: "Do you want to push the branch to the remote repository?",
			name: "shouldPush",
			type: "confirm",
		},
	]);

	if (shouldPush) {
		runGitCommand(`git push --set-upstream origin ${branchName}`);
		console.log(`✅ Branch ${branchName} pushed to remote repository!`);
	} else {
		console.log(`✅ Branch ${branchName} created locally!`);
	}
};
