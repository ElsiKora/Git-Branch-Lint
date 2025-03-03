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
 * Error thrown when branch name doesn't match the pattern
 */
export class PatternMatchError extends LintError {
	constructor(branchName: string) {
		super(`Branch "${branchName}" doesn't match pattern`);
		this.name = "PatternMatchError";
	}
}

/**
 * Error thrown when branch name is prohibited
 */
export class ProhibitedBranchError extends LintError {
	constructor(branchName: string) {
		super(`Branch "${branchName}" is prohibited`);
		this.name = "ProhibitedBranchError";
	}
}
