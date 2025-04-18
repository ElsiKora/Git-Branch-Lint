/**
 * Domain entity representing a Git branch
 */
export class Branch {
	private readonly VALUE: string;

	constructor(name: string) {
		this.VALUE = name;
	}

	public getName(): string {
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
