import { beforeEach, describe, expect, it, vi } from "vitest";

import { BuildBranchNameUseCase } from "../../../../../src/application/use-cases/build-branch-name.use-case";
import { CheckWorkingDirectoryUseCase } from "../../../../../src/application/use-cases/check-working-directory.use-case";
import { CreateBranchUseCase } from "../../../../../src/application/use-cases/create-branch.use-case";
import { GetBranchConfigUseCase } from "../../../../../src/application/use-cases/get-branch-config.use-case";
import { GetBranchPatternUseCase } from "../../../../../src/application/use-cases/get-branch-pattern.use-case";
import { GetBranchPlaceholderDefinitionsUseCase } from "../../../../../src/application/use-cases/get-branch-placeholder-definitions.use-case";
import { LintBranchNameUseCase } from "../../../../../src/application/use-cases/lint-branch-name.use-case";
import { NormalizeTicketIdUseCase } from "../../../../../src/application/use-cases/normalize-ticket-id.use-case";
import { PushBranchUseCase } from "../../../../../src/application/use-cases/push-branch.use-case";
import type { IBranchRepository } from "../../../../../src/domain/interface/branch.repository.interface";
import type { IConfigRepository } from "../../../../../src/domain/interface/config.repository.interface";
import { CreateBranchController } from "../../../../../src/presentation/cli/controllers/create-branch.controller";
import { BranchCreationPrompt } from "../../../../../src/presentation/cli/prompts/branch-creation.prompt";

describe("CreateBranchController", () => {
	let branchRepository: IBranchRepository;
	let configRepository: IConfigRepository;
	let controller: CreateBranchController;

	beforeEach(() => {
		branchRepository = {
			createBranch: vi.fn(),
			getCurrentBranchName: vi.fn().mockResolvedValue("main"),
			hasUncommittedChanges: vi.fn().mockResolvedValue(false),
			pushBranch: vi.fn(),
		};
		configRepository = {
			getConfig: vi.fn().mockResolvedValue({
				branches: {
					feature: { description: "Feature", title: "Feature" },
				},
				rules: {
					"branch-pattern": ":type/:ticket-:name",
					"branch-subject-pattern": "[a-z0-9-]+",
				},
			}),
		};

		controller = new CreateBranchController(new BuildBranchNameUseCase(), new CheckWorkingDirectoryUseCase(branchRepository), new CreateBranchUseCase(branchRepository), new GetBranchPatternUseCase(), new GetBranchPlaceholderDefinitionsUseCase(), new GetBranchConfigUseCase(configRepository), new LintBranchNameUseCase(), new NormalizeTicketIdUseCase(), new PushBranchUseCase(branchRepository));
	});

	it("should create local branch when user declines push", async () => {
		vi.spyOn(BranchCreationPrompt.prototype, "promptBranchType").mockResolvedValue("feature");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPlaceholder").mockResolvedValueOnce("PROJ-123").mockResolvedValueOnce("user-authentication");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPushBranch").mockResolvedValue(false);

		await controller.execute("git-branch-lint");

		expect(branchRepository.createBranch).toHaveBeenCalledWith("feature/proj-123-user-authentication");
		expect(branchRepository.pushBranch).not.toHaveBeenCalled();
	});

	it("should push branch when user confirms push", async () => {
		vi.spyOn(BranchCreationPrompt.prototype, "promptBranchType").mockResolvedValue("feature");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPlaceholder").mockResolvedValueOnce("").mockResolvedValueOnce("user-authentication");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPushBranch").mockResolvedValue(true);

		await controller.execute("git-branch-lint");

		expect(branchRepository.createBranch).toHaveBeenCalledWith("feature/user-authentication");
		expect(branchRepository.pushBranch).toHaveBeenCalledWith("feature/user-authentication");
	});

	it("should create branch for custom placeholder template", async () => {
		vi.mocked(configRepository.getConfig).mockResolvedValue({
			branches: {
				feat: { description: "Feature", title: "Feature" },
				fix: { description: "Fix", title: "Fix" },
			},
			rules: {
				"branch-pattern": ":scope/:type/:description",
				"branch-subject-pattern": {
					description: "[a-z0-9-]+",
					scope: "(web|api|shared)",
				},
			},
		});
		vi.spyOn(BranchCreationPrompt.prototype, "promptBranchType").mockResolvedValue("feat");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPlaceholder").mockResolvedValueOnce("web").mockResolvedValueOnce("shopping-cart");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPushBranch").mockResolvedValue(false);

		await controller.execute("git-branch-lint");

		expect(branchRepository.createBranch).toHaveBeenCalledWith("web/feat/shopping-cart");
	});

	it("should fail before create when assembled branch does not pass full lint rules", async () => {
		vi.mocked(configRepository.getConfig).mockResolvedValue({
			branches: {
				feature: { description: "Feature", title: "Feature" },
			},
			rules: {
				"branch-pattern": ":type/:name",
				"branch-subject-pattern": "[a-z0-9-]+",
			},
		});
		vi.spyOn(BranchCreationPrompt.prototype, "promptBranchType").mockResolvedValue("feature");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPlaceholder").mockResolvedValue("Invalid Name");
		vi.spyOn(BranchCreationPrompt.prototype, "promptPushBranch").mockResolvedValue(false);
		const processExitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		await controller.execute("git-branch-lint");
		expect(processExitSpy).toHaveBeenCalledWith(1);
		expect(branchRepository.createBranch).not.toHaveBeenCalled();

		processExitSpy.mockRestore();
		consoleErrorSpy.mockRestore();
	});
});
