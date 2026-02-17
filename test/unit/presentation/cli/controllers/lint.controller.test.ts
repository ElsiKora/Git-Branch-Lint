import { beforeEach, describe, expect, it, vi } from "vitest";

import { GetBranchConfigUseCase } from "../../../../../src/application/use-cases/get-branch-config.use-case";
import { GetCurrentBranchUseCase } from "../../../../../src/application/use-cases/get-current-branch.use-case";
import { LintBranchNameUseCase } from "../../../../../src/application/use-cases/lint-branch-name.use-case";
import { LintError } from "../../../../../src/domain/errors/lint.error";
import type { IBranchRepository } from "../../../../../src/domain/interface/branch.repository.interface";
import type { IConfigRepository } from "../../../../../src/domain/interface/config.repository.interface";
import { LintController } from "../../../../../src/presentation/cli/controllers/lint.controller";

class ThrowingLintBranchNameUseCase extends LintBranchNameUseCase {
	public override execute(): void {
		throw new LintError("forced lint error");
	}
}

describe("LintController", () => {
	let branchRepository: IBranchRepository;
	let configRepository: IConfigRepository;

	beforeEach(() => {
		branchRepository = {
			createBranch: vi.fn(),
			getCurrentBranchName: vi.fn().mockResolvedValue("feature/proj-123-user-authentication"),
			hasUncommittedChanges: vi.fn(),
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
	});

	it("should pass provided appName to config use case", async () => {
		const controller: LintController = new LintController(new GetBranchConfigUseCase(configRepository), new GetCurrentBranchUseCase(branchRepository), new LintBranchNameUseCase());

		await controller.execute("custom-app-name");

		expect(configRepository.getConfig).toHaveBeenCalledWith("custom-app-name");
	});

	it("should use provided appName in error handling path", async () => {
		const processExitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const controller: LintController = new LintController(new GetBranchConfigUseCase(configRepository), new GetCurrentBranchUseCase(branchRepository), new ThrowingLintBranchNameUseCase());

		await expect(controller.execute("custom-app-name")).rejects.toThrow(LintError);
		expect(configRepository.getConfig).toHaveBeenNthCalledWith(1, "custom-app-name");
		expect(configRepository.getConfig).toHaveBeenNthCalledWith(2, "custom-app-name");

		processExitSpy.mockRestore();
		consoleErrorSpy.mockRestore();
	});
});
