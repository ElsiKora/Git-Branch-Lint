import { describe, expect, it } from "vitest";

import { Branch } from "../../../../src/domain/entity/branch.entity";

describe("Branch Entity", () => {
	describe("constructor", () => {
		it("should create a branch with the given name", () => {
			const branchName = "feature/test-branch";
			const branch = new Branch(branchName);

			expect(branch.getName()).toBe(branchName);
		});
	});

	describe("getName", () => {
		it("should return the branch name", () => {
			const branchName = "bugfix/fix-issue";
			const branch = new Branch(branchName);

			expect(branch.getName()).toBe(branchName);
		});
	});

	describe("isProhibited", () => {
		it("should return true when branch name is in prohibited list", () => {
			const branch = new Branch("main");
			const prohibitedNames = ["main", "master", "develop"];

			expect(branch.isProhibited(prohibitedNames)).toBe(true);
		});

		it("should return false when branch name is not in prohibited list", () => {
			const branch = new Branch("feature/new-feature");
			const prohibitedNames = ["main", "master", "develop"];

			expect(branch.isProhibited(prohibitedNames)).toBe(false);
		});

		it("should handle empty prohibited list", () => {
			const branch = new Branch("main");
			const prohibitedNames: ReadonlyArray<string> = [];

			expect(branch.isProhibited(prohibitedNames)).toBe(false);
		});
	});

	describe("isTooLong", () => {
		it("should return true when branch name exceeds max length", () => {
			const longBranchName = "feature/this-is-a-very-long-branch-name-that-exceeds-the-maximum-allowed-length";
			const branch = new Branch(longBranchName);

			expect(branch.isTooLong(50)).toBe(true);
		});

		it("should return false when branch name is within max length", () => {
			const branch = new Branch("feature/short-name");

			expect(branch.isTooLong(50)).toBe(false);
		});

		it("should return false when maxLength is undefined", () => {
			const branch = new Branch("feature/any-length");

			expect(branch.isTooLong(undefined)).toBe(false);
		});

		it("should handle exact length boundary", () => {
			const branch = new Branch("exact");

			expect(branch.isTooLong(5)).toBe(false);
			expect(branch.isTooLong(4)).toBe(true);
		});
	});

	describe("isTooShort", () => {
		it("should return true when branch name is shorter than min length", () => {
			const branch = new Branch("fix");

			expect(branch.isTooShort(5)).toBe(true);
		});

		it("should return false when branch name meets min length", () => {
			const branch = new Branch("feature/new");

			expect(branch.isTooShort(5)).toBe(false);
		});

		it("should return false when minLength is undefined", () => {
			const branch = new Branch("x");

			expect(branch.isTooShort(undefined)).toBe(false);
		});

		it("should handle exact length boundary", () => {
			const branch = new Branch("exact");

			expect(branch.isTooShort(5)).toBe(false);
			expect(branch.isTooShort(6)).toBe(true);
		});
	});
}); 