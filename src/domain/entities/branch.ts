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

	public isTooLong(maxLength?: number): boolean {
		if (maxLength === undefined) {
			return false;
		}

		return this.VALUE.length > maxLength;
	}

	public isTooShort(minLength?: number): boolean {
		if (minLength === undefined) {
			return false;
		}

		return this.VALUE.length < minLength;
	}
}
