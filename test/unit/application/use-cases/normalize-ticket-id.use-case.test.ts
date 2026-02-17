import { describe, expect, it } from "vitest";

import { NormalizeTicketIdUseCase } from "../../../../src/application/use-cases/normalize-ticket-id.use-case";

describe("NormalizeTicketIdUseCase", () => {
	const useCase: NormalizeTicketIdUseCase = new NormalizeTicketIdUseCase();

	it("should normalize ticket id to lowercase", () => {
		expect(useCase.execute("PROJ-123")).toBe("proj-123");
	});

	it("should trim whitespace from ticket id", () => {
		expect(useCase.execute("   PROJ-123   ")).toBe("proj-123");
	});

	it("should return empty string for empty input", () => {
		expect(useCase.execute("   ")).toBe("");
	});
});
