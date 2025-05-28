import type { IBranchRepository } from "../../domain/interface/branch.repository.interface";

import { UncommittedChangesError } from "../../domain/errors/branch-creation.error";

/**
 * Use case for checking working directory status
 */
export class CheckWorkingDirectoryUseCase {
	public constructor(private readonly branchRepository: IBranchRepository) {}

	/**
	 * Execute the use case
	 * @throws {UncommittedChangesError} When there are uncommitted changes
	 */
	public async execute(): Promise<void> {
		const hasChanges: boolean = await this.branchRepository.hasUncommittedChanges();

		if (hasChanges) {
			throw new UncommittedChangesError();
		}
	}
}
