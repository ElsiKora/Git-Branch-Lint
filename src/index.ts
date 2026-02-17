import type { ArgumentsCamelCase } from "yargs";

import yargs from "yargs";

import { BuildBranchNameUseCase } from "./application/use-cases/build-branch-name.use-case";
import { CheckWorkingDirectoryUseCase } from "./application/use-cases/check-working-directory.use-case";
import { CreateBranchUseCase } from "./application/use-cases/create-branch.use-case";
import { GetBranchConfigUseCase } from "./application/use-cases/get-branch-config.use-case";
import { GetBranchPatternUseCase } from "./application/use-cases/get-branch-pattern.use-case";
import { GetBranchPlaceholderDefinitionsUseCase } from "./application/use-cases/get-branch-placeholder-definitions.use-case";
import { GetCurrentBranchUseCase } from "./application/use-cases/get-current-branch.use-case";
import { LintBranchNameUseCase } from "./application/use-cases/lint-branch-name.use-case";
import { NormalizeTicketIdUseCase } from "./application/use-cases/normalize-ticket-id.use-case";
import { PushBranchUseCase } from "./application/use-cases/push-branch.use-case";
import { CosmiconfigRepository } from "./infrastructure/config/cosmiconfig.repository";
import { GitBranchRepository } from "./infrastructure/git/git-branch.repository";
import { CreateBranchController } from "./presentation/cli/controllers/create-branch.controller";
import { LintController } from "./presentation/cli/controllers/lint.controller";

export type { IBranchLintConfig } from "./domain/type/config.type";

/**
 * Application name used for configuration
 */
const APP_NAME: string = "git-branch-lint";

const ARGS_SLICE_INDEX: number = 2;

const argv: ArgumentsCamelCase = yargs(process.argv.slice(ARGS_SLICE_INDEX))
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
	// Infrastructure layer
	const configRepository: CosmiconfigRepository = new CosmiconfigRepository();
	const branchRepository: GitBranchRepository = new GitBranchRepository();

	// Application layer - common use cases
	const getBranchConfigUseCase: GetBranchConfigUseCase = new GetBranchConfigUseCase(configRepository);

	const shouldRunBranch: boolean = Boolean(argv.branch);

	if (shouldRunBranch) {
		// Application layer - branch creation use cases
		const checkWorkingDirectoryUseCase: CheckWorkingDirectoryUseCase = new CheckWorkingDirectoryUseCase(branchRepository);
		const buildBranchNameUseCase: BuildBranchNameUseCase = new BuildBranchNameUseCase();
		const createBranchUseCase: CreateBranchUseCase = new CreateBranchUseCase(branchRepository);
		const getBranchPatternUseCase: GetBranchPatternUseCase = new GetBranchPatternUseCase();
		const getBranchPlaceholderDefinitionsUseCase: GetBranchPlaceholderDefinitionsUseCase = new GetBranchPlaceholderDefinitionsUseCase();
		const lintBranchNameUseCase: LintBranchNameUseCase = new LintBranchNameUseCase();
		const normalizeTicketIdUseCase: NormalizeTicketIdUseCase = new NormalizeTicketIdUseCase();
		const pushBranchUseCase: PushBranchUseCase = new PushBranchUseCase(branchRepository);

		// Presentation layer
		const createBranchController: CreateBranchController = new CreateBranchController(buildBranchNameUseCase, checkWorkingDirectoryUseCase, createBranchUseCase, getBranchPatternUseCase, getBranchPlaceholderDefinitionsUseCase, getBranchConfigUseCase, lintBranchNameUseCase, normalizeTicketIdUseCase, pushBranchUseCase);

		await createBranchController.execute(APP_NAME);
	} else {
		// Application layer - linting use cases
		const getCurrentBranchUseCase: GetCurrentBranchUseCase = new GetCurrentBranchUseCase(branchRepository);
		const lintBranchNameUseCase: LintBranchNameUseCase = new LintBranchNameUseCase();

		// Presentation layer
		const lintController: LintController = new LintController(getBranchConfigUseCase, getCurrentBranchUseCase, lintBranchNameUseCase);

		await lintController.execute(APP_NAME);
	}
};

// Bootstrap the application and handle errors
main().catch((error: unknown) => {
	console.error("[LintBranchName] Unhandled error occurred");

	throw error;
});
