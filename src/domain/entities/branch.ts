import type { TBranchName } from "../interfaces/branch-interfaces";

/**
 * Domain entity representing a Git branch
 */
export class Branch {
	private readonly VALUE: TBranchName;

	constructor(name: TBranchName) {
		this.VALUE = name;
	}

	public getName(): TBranchName {
		return this.VALUE;
	}

	public isProhibited(prohibitedNames: ReadonlyArray<string>): boolean {
		return prohibitedNames.includes(this.VALUE);
	}
}
