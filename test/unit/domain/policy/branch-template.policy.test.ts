import { describe, expect, it } from "vitest";

import { BranchTemplatePolicy } from "../../../../src/domain/policy/branch-template.policy";

describe("BranchTemplatePolicy", () => {
	const policy: BranchTemplatePolicy = new BranchTemplatePolicy();

	it("should extract placeholders in declaration order", () => {
		expect(policy.getPlaceholders(":scope/:type/:name")).toEqual(["scope", "type", "name"]);
	});

	it("should treat ticket placeholder as optional when pattern contains :ticket-", () => {
		expect(policy.isPlaceholderOptional(":type/:ticket-:name", "ticket")).toBe(true);
		expect(policy.isPlaceholderOptional(":type/:ticket-:name", "name")).toBe(false);
	});

	it("should build validation variants for optional placeholders", () => {
		expect(policy.buildValidationPatterns(":type/:ticket-:name")).toEqual([":type/:ticket-:name", ":type/:name"]);
	});

	it("should build branch name and drop empty optional placeholder", () => {
		const branchName: string = policy.buildBranchName(":type/:ticket-:name", {
			name: "checkout",
			ticket: "",
			type: "feature",
		});

		expect(branchName).toBe("feature/checkout");
	});

	it("should resolve placeholder source from object subject pattern", () => {
		const patternSource: string = policy.resolvePlaceholderPatternSource("scope", ["feature", "bugfix"], {
			scope: "(web|api)",
		});

		expect(patternSource).toBe("(web|api)");
	});

	it("should support placeholder names with hyphen", () => {
		expect(policy.getPlaceholders(":type/:jira-ticket-:description")).toEqual(["type", "jira-ticket", "description"]);
	});
});
