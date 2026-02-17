import type { IBranchPlaceholderDefinition } from "../../../application/type/branch-placeholder-definition.type";
import type { BuildBranchNameUseCase } from "../../../application/use-cases/build-branch-name.use-case";
import type { CheckWorkingDirectoryUseCase } from "../../../application/use-cases/check-working-directory.use-case";
import type { CreateBranchUseCase } from "../../../application/use-cases/create-branch.use-case";
import type { GetBranchConfigUseCase } from "../../../application/use-cases/get-branch-config.use-case";
import type { GetBranchPatternUseCase } from "../../../application/use-cases/get-branch-pattern.use-case";
import type { GetBranchPlaceholderDefinitionsUseCase } from "../../../application/use-cases/get-branch-placeholder-definitions.use-case";
import type { LintBranchNameUseCase } from "../../../application/use-cases/lint-branch-name.use-case";
import type { NormalizeTicketIdUseCase } from "../../../application/use-cases/normalize-ticket-id.use-case";
import type { PushBranchUseCase } from "../../../application/use-cases/push-branch.use-case";
import type { IBranchLintConfig } from "../../../domain/type/config.type";

import { BranchAlreadyExistsError, BranchCreationError, UncommittedChangesError } from "../../../domain/errors/branch-creation.error";
import { BranchCreationPrompt } from "../prompts/branch-creation.prompt";

/**
 * Controller for branch creation CLI operations
 */
export class CreateBranchController {
	private readonly BRANCH_CREATION_PROMPT: BranchCreationPrompt;

	private readonly BUILD_BRANCH_NAME_USE_CASE: BuildBranchNameUseCase;

	private readonly CHECK_WORKING_DIRECTORY_USE_CASE: CheckWorkingDirectoryUseCase;

	private readonly CREATE_BRANCH_USE_CASE: CreateBranchUseCase;

	private readonly GET_BRANCH_CONFIG_USE_CASE: GetBranchConfigUseCase;

	private readonly GET_BRANCH_PATTERN_USE_CASE: GetBranchPatternUseCase;

	private readonly GET_BRANCH_PLACEHOLDER_DEFINITIONS_USE_CASE: GetBranchPlaceholderDefinitionsUseCase;

	private readonly LINT_BRANCH_NAME_USE_CASE: LintBranchNameUseCase;

	private readonly NORMALIZE_TICKET_ID_USE_CASE: NormalizeTicketIdUseCase;

	private readonly PUSH_BRANCH_USE_CASE: PushBranchUseCase;

	public constructor(
		buildBranchNameUseCase: BuildBranchNameUseCase,
		checkWorkingDirectoryUseCase: CheckWorkingDirectoryUseCase,
		createBranchUseCase: CreateBranchUseCase,
		getBranchPatternUseCase: GetBranchPatternUseCase,
		getBranchPlaceholderDefinitionsUseCase: GetBranchPlaceholderDefinitionsUseCase,
		getBranchConfigUseCase: GetBranchConfigUseCase,
		lintBranchNameUseCase: LintBranchNameUseCase,
		normalizeTicketIdUseCase: NormalizeTicketIdUseCase,
		pushBranchUseCase: PushBranchUseCase,
	) {
		this.BUILD_BRANCH_NAME_USE_CASE = buildBranchNameUseCase;
		this.CHECK_WORKING_DIRECTORY_USE_CASE = checkWorkingDirectoryUseCase;
		this.CREATE_BRANCH_USE_CASE = createBranchUseCase;
		this.GET_BRANCH_CONFIG_USE_CASE = getBranchConfigUseCase;
		this.GET_BRANCH_PATTERN_USE_CASE = getBranchPatternUseCase;
		this.GET_BRANCH_PLACEHOLDER_DEFINITIONS_USE_CASE = getBranchPlaceholderDefinitionsUseCase;
		this.LINT_BRANCH_NAME_USE_CASE = lintBranchNameUseCase;
		this.NORMALIZE_TICKET_ID_USE_CASE = normalizeTicketIdUseCase;
		this.PUSH_BRANCH_USE_CASE = pushBranchUseCase;
		this.BRANCH_CREATION_PROMPT = new BranchCreationPrompt();
	}

	/**
	 * Execute the branch creation flow
	 * @param appName The application name for configuration
	 */
	public async execute(appName: string): Promise<void> {
		try {
			// Check working directory
			await this.CHECK_WORKING_DIRECTORY_USE_CASE.execute();

			console.error("🌿 Creating a new branch...\n");

			// Get configuration
			const config: IBranchLintConfig = await this.GET_BRANCH_CONFIG_USE_CASE.execute(appName);
			const branchPattern: string = this.GET_BRANCH_PATTERN_USE_CASE.execute(config);
			const placeholderDefinitions: Array<IBranchPlaceholderDefinition> = this.GET_BRANCH_PLACEHOLDER_DEFINITIONS_USE_CASE.execute({ config });
			const placeholderValues: Record<string, string> = {};

			for (const placeholderDefinition of placeholderDefinitions) {
				if (placeholderDefinition.isTypePlaceholder) {
					placeholderValues.type = await this.BRANCH_CREATION_PROMPT.promptBranchType(config.branches);
					continue;
				}

				const inputValue: string = await this.BRANCH_CREATION_PROMPT.promptPlaceholder({
					example: placeholderDefinition.example,
					isOptional: placeholderDefinition.isOptional,
					patternSource: placeholderDefinition.patternSource ?? "",
					placeholderName: placeholderDefinition.placeholderName,
				});

				placeholderValues[placeholderDefinition.placeholderName] = placeholderDefinition.placeholderName === "ticket" ? this.NORMALIZE_TICKET_ID_USE_CASE.execute(inputValue) : inputValue;
			}

			const fullBranchName: string = this.BUILD_BRANCH_NAME_USE_CASE.execute({
				branchPattern,
				placeholderValues,
			});

			// Re-validate the final assembled branch name with full lint rules before creation.
			this.LINT_BRANCH_NAME_USE_CASE.execute(fullBranchName, config);

			console.error(`\n⌛️ Creating branch: ${fullBranchName}`);

			// Create the branch
			await this.CREATE_BRANCH_USE_CASE.execute(fullBranchName);

			// Ask about pushing to remote
			const shouldPush: boolean = await this.BRANCH_CREATION_PROMPT.promptPushBranch();

			if (shouldPush) {
				await this.PUSH_BRANCH_USE_CASE.execute(fullBranchName);
				console.error(`✅ Branch ${fullBranchName} pushed to remote repository!`);
			} else {
				console.error(`✅ Branch ${fullBranchName} created locally!`);
			}
		} catch (error) {
			this.handleError(error as Error);
		}
	}

	/**
	 * Handle errors that occur during branch creation
	 * @param error The error that occurred
	 */
	private handleError(error: Error): void {
		if (error instanceof UncommittedChangesError) {
			console.error(`⚠️ ${error.message}`);
			// eslint-disable-next-line @elsikora/unicorn/no-process-exit
			process.exit(1);
		}

		if (error instanceof BranchAlreadyExistsError) {
			console.error(`⚠️ ${error.message}`);
			// eslint-disable-next-line @elsikora/unicorn/no-process-exit
			process.exit(0);
		}

		if (error instanceof BranchCreationError) {
			console.error(`❌ ${error.message}`);
			// eslint-disable-next-line @elsikora/unicorn/no-process-exit
			process.exit(1);
		}

		console.error(`❌ Failed to create branch: ${error.message}`);
		// eslint-disable-next-line @elsikora/unicorn/no-process-exit
		process.exit(1);
	}
}
