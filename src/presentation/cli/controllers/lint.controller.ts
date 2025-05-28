import type { GetBranchConfigUseCase } from "../../../application/use-cases/get-branch-config.use-case";
import type { GetCurrentBranchUseCase } from "../../../application/use-cases/get-current-branch.use-case";
import type { LintBranchNameUseCase } from "../../../application/use-cases/lint-branch-name.use-case";
import type { IBranchLintConfig } from "../../../domain/type/config.type";

import { LintError } from "../../../domain/errors/lint.error";
import { ErrorFormatter } from "../formatters/error.formatter";
import { HintFormatter } from "../formatters/hint.formatter";

/**
 * Controller for linting CLI operations
 */
export class LintController {
	private readonly ERROR_FORMATTER: ErrorFormatter;

	private readonly GET_BRANCH_CONFIG_USE_CASE: GetBranchConfigUseCase;

	private readonly GET_CURRENT_BRANCH_USE_CASE: GetCurrentBranchUseCase;

	private readonly HINT_FORMATTER: HintFormatter;

	private readonly LINT_BRANCH_NAME_USE_CASE: LintBranchNameUseCase;

	/**
	 * Constructor
	 * @param getBranchConfigUseCase The use case for getting branch configuration
	 * @param getCurrentBranchUseCase The use case for getting the current branch
	 * @param lintBranchNameUseCase The use case for linting branch names
	 */
	constructor(getBranchConfigUseCase: GetBranchConfigUseCase, getCurrentBranchUseCase: GetCurrentBranchUseCase, lintBranchNameUseCase: LintBranchNameUseCase) {
		this.GET_BRANCH_CONFIG_USE_CASE = getBranchConfigUseCase;
		this.GET_CURRENT_BRANCH_USE_CASE = getCurrentBranchUseCase;
		this.LINT_BRANCH_NAME_USE_CASE = lintBranchNameUseCase;
		this.ERROR_FORMATTER = new ErrorFormatter();
		this.HINT_FORMATTER = new HintFormatter();
	}

	/**
	 * Execute the CLI command
	 * @param appName The application name
	 */
	public async execute(appName: string): Promise<void> {
		try {
			const [config, branchName]: [IBranchLintConfig, string] = await Promise.all([this.GET_BRANCH_CONFIG_USE_CASE.execute(appName), this.GET_CURRENT_BRANCH_USE_CASE.execute()]);

			this.LINT_BRANCH_NAME_USE_CASE.execute(branchName, config);
		} catch (error: unknown) {
			await this.handleError(error as Error);
		}
	}

	/**
	 * Handle errors that occur during execution
	 * @param error The error that occurred
	 */
	private async handleError(error: Error): Promise<void> {
		if (!(error instanceof Error)) {
			console.error(this.ERROR_FORMATTER.format("[LintBranchName] Unhandled error occurred"));

			throw new Error("Unknown error occurred");
		}

		if (error instanceof LintError) {
			try {
				// Get the configuration using the service instead of hardcoded values
				const config: IBranchLintConfig = await this.GET_BRANCH_CONFIG_USE_CASE.execute("git-branch-lint");

				console.error(this.ERROR_FORMATTER.format(error.message));
				console.error(this.HINT_FORMATTER.format(error, config));

				// Since this is a CLI tool, it's appropriate to exit the process on validation errors
				// ESLint wants us to throw instead, but this is a CLI application where exit is acceptable
				// eslint-disable-next-line @elsikora/unicorn/no-process-exit
				process.exit(1);
			} catch {
				console.error(this.ERROR_FORMATTER.format("Failed to load configuration for error hint"));
				console.error(this.ERROR_FORMATTER.format(error.message));

				// eslint-disable-next-line @elsikora/unicorn/no-process-exit
				process.exit(1);
			}
		}

		throw error;
	}
}
