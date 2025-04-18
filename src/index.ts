import yargs from "yargs";

import { createBranch } from "./application/create-branch-tool/createBranch";
import { GetBranchConfigUseCase } from "./application/use-cases/get-branch-config-use-case";
import { GetCurrentBranchUseCase } from "./application/use-cases/get-current-branch-use-case";
import { LintBranchNameUseCase } from "./application/use-cases/lint-branch-name-use-case";
import { CosmiconfigRepository } from "./infrastructure/config/cosmiconfig-repository";
import { GitBranchRepository } from "./infrastructure/git/git-branch-repository";
import { CliController } from "./presentation/cli/cli-controller";
export type { BranchLintConfig } from "./domain/interfaces/config.type";

/**
 * Application name used for configuration
 */
const APP_NAME: string = "git-branch-lint";

const argv: {
	branch: boolean | undefined;
	// eslint-disable-next-line @elsikora/typescript/no-magic-numbers
} = yargs(process.argv.slice(2))
	.option("branch", {
		alias: "b",
		description: "Run branch creation tool",
		type: "boolean",
	})
	.help()
	.usage("Usage: $0 [-b] to create a branch or lint the current branch")
	.parseSync();

/**
 * Main function that bootstraps the application
 */
const main = async (): Promise<void> => {
	if (argv.branch) {
		try {
			await createBranch(APP_NAME);
		} catch (error) {
			console.error("❌ Failed to create branch:", (error as Error).message);
			// eslint-disable-next-line @elsikora/unicorn/no-process-exit
			process.exit(1);
		}
	} else {
		// Infrastructure layer
		const configRepository: CosmiconfigRepository = new CosmiconfigRepository();
		const branchRepository: GitBranchRepository = new GitBranchRepository();

		// Application layer
		const getBranchConfigUseCase: GetBranchConfigUseCase = new GetBranchConfigUseCase(configRepository);
		const getCurrentBranchUseCase: GetCurrentBranchUseCase = new GetCurrentBranchUseCase(branchRepository);
		const lintBranchNameUseCase: LintBranchNameUseCase = new LintBranchNameUseCase();

		// Presentation layer
		const cliController: CliController = new CliController(getBranchConfigUseCase, getCurrentBranchUseCase, lintBranchNameUseCase);

		// Execute the application
		await cliController.execute(APP_NAME);
	}
};

// Bootstrap the application and handle errors
main().catch((error: unknown) => {
	console.error("[LintBranchName] Unhandled error occurred");

	throw error;
});
