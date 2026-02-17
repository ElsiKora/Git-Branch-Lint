import { beforeEach, describe, expect, it } from "vitest";

import { BranchChoiceFormatter } from "../../../../../src/presentation/cli/formatters/branch-choice.formatter";
import type { TBranchList } from "../../../../../src/domain/type/branch.type";

describe("BranchChoiceFormatter", () => {
	let formatter: BranchChoiceFormatter;

	beforeEach(() => {
		formatter = new BranchChoiceFormatter();
	});

	describe("format", () => {
		describe("with array branch list", () => {
			it("should format simple array of branch names", () => {
				const branches: TBranchList = ["feature", "bugfix", "hotfix"];

				const result = formatter.format(branches);

				expect(result).toHaveLength(3);
				expect(result[0]).toEqual({
					name: "feature",
					short: "feature",
					value: "feature",
				});
				expect(result[1]).toEqual({
					name: "bugfix",
					short: "bugfix",
					value: "bugfix",
				});
				expect(result[2]).toEqual({
					name: "hotfix",
					short: "hotfix",
					value: "hotfix",
				});
			});

			it("should handle empty array", () => {
				const branches: TBranchList = [];

				const result = formatter.format(branches);

				expect(result).toHaveLength(0);
			});
		});

		describe("with object branch list", () => {
			it("should format branches with descriptions and proper spacing", () => {
				const branches: TBranchList = {
					feature: { description: "New functionality", title: "Feature" },
					bug: { description: "Bug fixes", title: "Bug" },
					hotfix: { description: "Urgent fixes", title: "Hotfix" },
				};

				const result = formatter.format(branches);

				expect(result).toHaveLength(3);

				// Check that longer branch names get proper padding
				expect(result[0].name).toMatch(/Feature:\s+New functionality/);
				expect(result[0].short).toBe("Feature");
				expect(result[0].value).toBe("feature");

				expect(result[1].name).toMatch(/Bug:\s+Bug fixes/);
				expect(result[1].short).toBe("Bug");
				expect(result[1].value).toBe("bug");
			});

			it("should calculate padding based on longest branch name", () => {
				const branches: TBranchList = {
					a: { description: "Short", title: "A" },
					verylongbranchname: { description: "Long", title: "Very Long" },
				};

				const result = formatter.format(branches);

				// The short branch should have more padding
				expect(result[0].name).toContain("A:");
				expect(result[0].name).toMatch(/A:\s{20,}/); // Should have significant padding
				expect(result[1].name).toMatch(/Very Long:\s{5}Long/); // Should have exactly 5 spaces (EMPTY_SPACING_OFFSET)
			});

			it("should handle empty object", () => {
				const branches: TBranchList = {};

				const result = formatter.format(branches);

				expect(result).toHaveLength(0);
			});

			it("should preserve order of object keys", () => {
				const branches: TBranchList = {
					zebra: { description: "Z branch", title: "Zebra" },
					alpha: { description: "A branch", title: "Alpha" },
					beta: { description: "B branch", title: "Beta" },
				};

				const result = formatter.format(branches);

				expect(result[0].value).toBe("zebra");
				expect(result[1].value).toBe("alpha");
				expect(result[2].value).toBe("beta");
			});
		});
	});
});
