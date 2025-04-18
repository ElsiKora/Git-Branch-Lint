/* eslint-disable @elsikora/node/no-extraneous-import */
import type { BranchList } from "../../../domain/interfaces/branch.type.js";

import inquirer from "inquirer";

import { alignChoices } from "./alignChoices.js";

export const branchNameQuiz = async (branchList: BranchList): Promise<string> => {
	const { branchType }: { branchType: string } = await inquirer.prompt<{ branchType: string }>([
		{
			choices: alignChoices(branchList),
			message: "Select the type of branch you're creating:",
			name: "branchType",
			type: "list",
		},
	]);

	const { branchName }: { branchName: string } = await inquirer.prompt<{ branchName: string }>([
		{
			message: "Enter the branch name (e.g., authorization):",
			name: "branchName",
			type: "input",
			// Валидация названия ветки
			// eslint-disable-next-line @elsikora/sonar/function-return-type
			validate: (input: string): boolean | string => {
				if (!input.trim()) {
					return "Branch name cannot be empty!";
				}

				if (!/^[a-z0-9-]+$/.test(input)) {
					return "Branch name can only contain lowercase letters, numbers, and hyphens!";
				}

				return true;
			},
		},
	]);

	const fullBranchName: string = `${branchType}/${branchName}`;
	console.log(`\n⌛️ Creating branch: ${fullBranchName}`);

	return fullBranchName;
};
