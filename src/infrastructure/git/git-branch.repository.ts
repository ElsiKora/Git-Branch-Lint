import type { IBranchRepository } from "../../domain/interface/branch.repository.interface";

import { exec } from "node:child_process";
import { promisify } from "node:util";

import { GitOperationError } from "../../domain/errors/branch-creation.error";

const execAsync: typeof exec.__promisify__ = promisify(exec);

/**
 * Git implementation of BranchRepository
 */
export class GitBranchRepository implements IBranchRepository {
	/**
	 * Create a new branch
	 * @param branchName The name of the branch to create
	 */
	public async createBranch(branchName: string): Promise<void> {
		try {
			const command: string = `git checkout -b ${branchName}`;
			await execAsync(command);
		} catch (error) {
			throw new GitOperationError("create branch", (error as Error).message);
		}
	}

	/**
	 * Get the current branch name
	 * @returns A promise that resolves to the current branch name
	 */
	public async getCurrentBranchName(): Promise<string> {
		try {
			const command: string = "git rev-parse --abbrev-ref HEAD";
			const { stdout }: { stdout: string } = await execAsync(command);

			return stdout.trim();
		} catch (error) {
			throw new GitOperationError("get current branch", (error as Error).message);
		}
	}

	/**
	 * Check if working directory has uncommitted changes
	 * @returns A promise that resolves to true if there are uncommitted changes
	 */
	public async hasUncommittedChanges(): Promise<boolean> {
		try {
			const command: string = "git status --porcelain";
			const { stdout }: { stdout: string } = await execAsync(command);

			return stdout.trim().length > 0;
		} catch (error) {
			throw new GitOperationError("check working directory status", (error as Error).message);
		}
	}

	/**
	 * Push branch to remote repository
	 * @param branchName The name of the branch to push
	 */
	public async pushBranch(branchName: string): Promise<void> {
		try {
			const command: string = `git push --set-upstream origin ${branchName}`;
			await execAsync(command);
		} catch (error) {
			throw new GitOperationError("push branch", (error as Error).message);
		}
	}
}
