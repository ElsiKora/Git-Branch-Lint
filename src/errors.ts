export class LintError extends Error {
	constructor(message: string) {
		super(`[Git-Branch-Lint] ${message}`);
	}
}
export const branchProtectedError: LintError = new LintError("Protected branch");
export const branchNamePatternError: LintError = new LintError("Branch name doesnt match the pattern");
