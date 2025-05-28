/**
 * Base error class for branch creation errors
 */
export class BranchCreationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "BranchCreationError";
	}
}

/**
 * Error thrown when trying to create a branch that already exists
 */
export class BranchAlreadyExistsError extends BranchCreationError {
	constructor(branchName: string) {
		super(`You are already on branch ${branchName}!`);
		this.name = "BranchAlreadyExistsError";
	}
}

/**
 * Error thrown when git operation fails
 */
export class GitOperationError extends BranchCreationError {
	constructor(operation: string, details?: string) {
		const message: string = details ? `Git operation failed: ${operation} - ${details}` : `Git operation failed: ${operation}`;
		super(message);
		this.name = "GitOperationError";
	}
}

/**
 * Error thrown when working directory has uncommitted changes
 */
export class UncommittedChangesError extends BranchCreationError {
	constructor() {
		super("You have uncommitted changes. Please commit or stash them before creating a new branch.");
		this.name = "UncommittedChangesError";
	}
}
