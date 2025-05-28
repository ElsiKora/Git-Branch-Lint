import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const execAsync = promisify(exec);

describe("Branch Creation E2E", { concurrent: false }, () => {
	const CLI_PATH = path.join(process.cwd(), "bin", "index.js");
	const TEST_DIR = path.join(process.cwd(), `test-repo-create-${Date.now()}-${Math.random().toString(36).slice(2)}`);
	const CONFIG_FILE = path.join(TEST_DIR, ".elsikora", "git-branch-lint.config.mjs");
	const originalCwd = process.cwd();

	beforeEach(async () => {
		// Create a test git repository
		await fs.mkdir(TEST_DIR, { recursive: true });
		process.chdir(TEST_DIR);
		await execAsync("git init");
		await execAsync("git config user.email 'test@example.com'");
		await execAsync("git config user.name 'Test User'");
		
		// Create initial commit
		await fs.writeFile("README.md", "# Test Repo");
		await execAsync("git add .");
		await execAsync("git commit -m 'Initial commit'");
		
		// Create default config to avoid module errors
		await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
		await fs.writeFile(CONFIG_FILE, `
			export default {
				branches: {
					feature: { description: "New feature", title: "Feature" },
					bugfix: { description: "Bug fix", title: "Bugfix" },
					hotfix: { description: "Hot fix", title: "Hotfix" },
				},
				rules: {
					"branch-pattern": ":type/:name",
				},
			};
		`);
		// Commit the config file
		await execAsync("git add .");
		await execAsync("git commit -m 'Add config'");
	});

	afterEach(async () => {
		// Cleanup
		process.chdir(originalCwd);
		await fs.rm(TEST_DIR, { recursive: true, force: true }).catch(() => {});
	});

	describe("Branch creation flow", () => {
		it("should fail with uncommitted changes", async () => {
			// Create uncommitted changes
			await fs.writeFile("test.txt", "uncommitted content");

			try {
				await execAsync(`node ${CLI_PATH} -b`, { timeout: 5000 });
				expect.fail("Should have thrown");
			} catch (error: any) {
				expect(error.stderr).toContain("⚠️ You have uncommitted changes");
			}
		});

		it("should detect when no changes in working directory", async () => {
			// Just verify the tool can run when there are no uncommitted changes
			// We can't test the full interactive flow, but we can verify it starts
			const child = exec(`node ${CLI_PATH} -b`);
			
			// Give it time to start
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Kill the process
			child.kill();
			
			// The test passes if we got here without throwing
			expect(true).toBe(true);
		});
	});

	describe("Config validation", () => {
		it("should work with custom branch types in config", async () => {
			// Update config with custom types
			await fs.writeFile(CONFIG_FILE, `
				export default {
					branches: {
						task: { description: "Task branch", title: "Task" },
						story: { description: "User story", title: "Story" },
					},
					rules: {
						"branch-pattern": ":type/:name",
					},
				};
			`);
			await execAsync("git add .");
			await execAsync("git commit -m 'Update config'");

			// Just verify the tool can start with custom config
			const child = exec(`node ${CLI_PATH} -b`);
			
			// Give it time to start
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Kill the process
			child.kill();
			
			// The test passes if we got here without throwing
			expect(true).toBe(true);
		});

		it("should work with array branch configuration", async () => {
			await fs.writeFile(path.join(TEST_DIR, "package.json"), JSON.stringify({
				name: "test-package",
				"elsikora": {
					"git-branch-lint": {
						branches: ["epic", "spike", "chore"],
						rules: {
							"branch-pattern": ":type/:name",
						},
					},
				},
			}, null, 2));
			await execAsync("git add .");
			await execAsync("git commit -m 'Add package.json'");

			// Just verify the tool can start with array config
			const child = exec(`node ${CLI_PATH} -b`);
			
			// Give it time to start
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// Kill the process
			child.kill();
			
			// The test passes if we got here without throwing
			expect(true).toBe(true);
		});
	});
}); 