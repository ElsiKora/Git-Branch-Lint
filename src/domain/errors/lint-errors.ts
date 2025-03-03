/**
 * Base error class for branch linting errors
 */
export class LintError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "LintError";
	}
}

/**
 * Error thrown when branch name is too long
 */
export class BranchTooLongError extends LintError {
	constructor(branchName: string, maxLength: number) {
		// eslint-disable-next-line @elsikora-typescript/restrict-template-expressions
		super(`Branch name "${branchName}" is too long (maximum length: ${maxLength})`);
		this.name = "BranchTooLongError";
	}
}

/**
 * Error thrown when branch name is too short
 */
export class BranchTooShortError extends LintError {
	constructor(branchName: string, minLength: number) {
		// eslint-disable-next-line @elsikora-typescript/restrict-template-expressions
		super(`Branch name "${branchName}" is too short (minimum length: ${minLength})`);
		this.name = "BranchTooShortError";
	}
}

/**
 * Error thrown when branch name doesn't match the pattern
 */
export class PatternMatchError extends LintError {
	constructor(branchName: string) {
		super(`Branch name "${branchName}" doesn't match pattern`);
		this.name = "PatternMatchError";
	}
}

/**
 * Error thrown when branch name is prohibited
 */
export class ProhibitedBranchError extends LintError {
	constructor(branchName: string) {
		super(`Branch name "${branchName}" is prohibited`);
		this.name = "ProhibitedBranchError";
	}
}
