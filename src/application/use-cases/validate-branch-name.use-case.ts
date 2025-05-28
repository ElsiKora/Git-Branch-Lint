/**
 * Use case for validating branch name format
 */
export class ValidateBranchNameUseCase {
	private readonly BRANCH_NAME_PATTERN: RegExp = /^[a-z0-9-]+$/;

	/**
	 * Execute the use case
	 * @param branchName The branch name to validate
	 * @returns Validation result with error message if invalid
	 */
	public execute(branchName: string): { errorMessage?: string; isValid: boolean } {
		if (!branchName.trim()) {
			return {
				errorMessage: "Branch name cannot be empty!",
				isValid: false,
			};
		}

		if (!this.BRANCH_NAME_PATTERN.test(branchName)) {
			return {
				errorMessage: "Branch name can only contain lowercase letters, numbers, and hyphens!",
				isValid: false,
			};
		}

		return { isValid: true };
	}
}
