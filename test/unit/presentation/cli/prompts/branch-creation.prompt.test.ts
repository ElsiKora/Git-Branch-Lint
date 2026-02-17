import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("inquirer", () => ({
	default: {
		prompt: vi.fn(),
	},
}));

import inquirer from "inquirer";

import { BranchCreationPrompt } from "../../../../../src/presentation/cli/prompts/branch-creation.prompt";

describe("BranchCreationPrompt", () => {
	const promptMock = vi.mocked(inquirer.prompt);
	let prompt: BranchCreationPrompt;

	beforeEach(() => {
		prompt = new BranchCreationPrompt();
		promptMock.mockReset();
	});

	it("should prompt and validate required placeholder value", async () => {
		promptMock.mockImplementation(async (questions) => {
			const placeholderPrompt = questions[0];

			expect(placeholderPrompt.validate?.("web")).toBe(true);
			expect(placeholderPrompt.validate?.("mobile")).toContain("Invalid scope format");

			return { value: "web" };
		});

		const value: string = await prompt.promptPlaceholder({
			isOptional: false,
			patternSource: "(web|api)",
			placeholderName: "scope",
		});

		expect(value).toBe("web");
	});

	it("should allow skipping optional placeholder", async () => {
		promptMock.mockImplementation(async (questions) => {
			const placeholderPrompt = questions[0];

			expect(placeholderPrompt.validate?.("")).toBe(true);

			return { value: "   " };
		});

		const value: string = await prompt.promptPlaceholder({
			example: "PROJ-123",
			isOptional: true,
			patternSource: "[a-z]{2,}-[0-9]+",
			placeholderName: "ticket",
		});

		expect(value).toBe("");
	});

	it("should accept ticket placeholder in uppercase input", async () => {
		promptMock.mockImplementation(async (questions) => {
			const placeholderPrompt = questions[0];

			expect(placeholderPrompt.validate?.("DFSF-33")).toBe(true);

			return { value: "DFSF-33" };
		});

		const value: string = await prompt.promptPlaceholder({
			example: "PROJ-123",
			isOptional: false,
			patternSource: "[a-z]{2,}-[0-9]+",
			placeholderName: "ticket",
		});

		expect(value).toBe("DFSF-33");
	});
});
