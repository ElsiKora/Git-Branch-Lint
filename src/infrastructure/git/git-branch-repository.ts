import type { TBranchName } from "../../domain/interfaces/branch-interfaces";
import type { IBranchRepository } from "../../domain/interfaces/repository-interfaces";

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync: typeof exec.__promisify__ = promisify(exec);

/**
 * Git implementation of BranchRepository
 */
export class GitBranchRepository implements IBranchRepository {
	/**
	 * Get the current branch name
	 * @returns A promise that resolves to the current branch name
	 */
	public async getCurrentBranchName(): Promise<TBranchName> {
		const command: string = "git rev-parse --abbrev-ref HEAD";
		const { stdout }: { stdout: string } = await execAsync(command);

		return stdout.trim();
	}
}
