import { GetBranchConfigUseCase } from "./application/use-cases/get-branch-config-use-case";
import { GetCurrentBranchUseCase } from "./application/use-cases/get-current-branch-use-case";
import { LintBranchNameUseCase } from "./application/use-cases/lint-branch-name-use-case";
import { CosmiconfigRepository } from "./infrastructure/config/cosmiconfig-repository";
import { GitBranchRepository } from "./infrastructure/git/git-branch-repository";
import { CliController } from "./presentation/cli/cli-controller";

/**
 * Application name used for configuration
 */
const APP_NAME: string = "git-branch-lint";

/**
 * Main function that bootstraps the application
 */
const main = async (): Promise<void> => {
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
};

// Bootstrap the application and handle errors
main().catch((error: unknown) => {
	console.error("[LintBranchName] Unhandled error occurred");

	throw error;
});
