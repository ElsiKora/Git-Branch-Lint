import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";

const execAsync = promisify(exec);

describe("Branch Linting E2E", { concurrent: false }, () => {
	const CLI_PATH = path.join(process.cwd(), "bin", "index.js");
	const TEST_DIR = path.join(process.cwd(), `test-repo-${Date.now()}-${Math.random().toString(36).slice(2)}`);
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
	});

	afterEach(async () => {
		// Cleanup
		process.chdir(originalCwd);
		await fs.rm(TEST_DIR, { recursive: true, force: true }).catch(() => {});
	});

	describe("Default configuration", () => {
		it("should pass for valid branch names", async () => {
			await execAsync("git checkout -b feature/new-feature");
			const { stdout, stderr } = await execAsync(`node ${CLI_PATH}`);
			
			expect(stderr).toBe("");
			expect(stdout).toBe("");
		});

		it("should fail for prohibited branch names", async () => {
			// Create default config first
			await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
			await fs.writeFile(CONFIG_FILE, `
				export default {
					branches: ["feature", "bugfix", "hotfix"],
					rules: {
						"branch-prohibited": ["main", "master"],
					},
				};
			`);
			
			await execAsync("git checkout -b main");
			
			await expect(execAsync(`node ${CLI_PATH}`)).rejects.toThrow();
		});

		it("should fail for branch names that don't match pattern", async () => {
			// Create config with pattern
			await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
			await fs.writeFile(CONFIG_FILE, `
				export default {
					branches: ["feature", "bugfix", "hotfix"],
					rules: {
						"branch-pattern": ":type/:name",
					},
				};
			`);
			
			await execAsync("git checkout -b invalid-branch-name");
			
			await expect(execAsync(`node ${CLI_PATH}`)).rejects.toThrow();
		});
	});

	describe("Custom configuration", () => {
		beforeEach(async () => {
			// Create custom config - use .mjs extension for ES modules
			await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
			await fs.writeFile(CONFIG_FILE, `
				export default {
					branches: {
						feat: { description: "Feature", title: "Feature" },
						fix: { description: "Bug fix", title: "Fix" },
					},
					ignore: ["wip"],
					rules: {
						"branch-pattern": ":type/:name",
						"branch-min-length": 8,
						"branch-max-length": 30,
						"branch-prohibited": ["master", "develop"],
						"branch-subject-pattern": "[a-z0-9-]+",
					},
				};
			`);
		});

		it("should use custom branch types", async () => {
			await execAsync("git checkout -b feat/custom-feature");
			const { stdout, stderr } = await execAsync(`node ${CLI_PATH}`);
			
			expect(stderr).toBe("");
			expect(stdout).toBe("");
		});

		it("should respect ignore list", async () => {
			await execAsync("git checkout -b wip");
			const { stdout, stderr } = await execAsync(`node ${CLI_PATH}`);
			
			expect(stderr).toBe("");
			expect(stdout).toBe("");
		});

		it("should enforce custom length rules", async () => {
			await execAsync("git checkout -b feat/x");
			
			await expect(execAsync(`node ${CLI_PATH}`)).rejects.toThrow();
		});

		it("should enforce custom prohibited branches", async () => {
			await execAsync("git checkout -b develop");
			
			await expect(execAsync(`node ${CLI_PATH}`)).rejects.toThrow();
		});
	});

	describe("Error messages and hints", () => {
		beforeEach(async () => {
			// Create default config
			await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
			await fs.writeFile(CONFIG_FILE, `
				export default {
					branches: ["feature", "bugfix", "hotfix"],
					rules: {
						"branch-pattern": ":type/:name",
						"branch-prohibited": ["main", "master"],
					},
				};
			`);
		});

		it("should show helpful error for pattern mismatch", async () => {
			await execAsync("git checkout -b wrong-format");
			
			try {
				await execAsync(`node ${CLI_PATH}`);
				expect.fail("Should have thrown");
			} catch (error: any) {
				expect(error.stderr).toContain("doesn't match pattern");
				expect(error.stderr).toContain("Expected pattern:");
				expect(error.stderr).toContain("Valid branch types:");
			}
		});

		it("should show helpful error for prohibited branch", async () => {
			await execAsync("git checkout -b main");
			
			try {
				await execAsync(`node ${CLI_PATH}`);
				expect.fail("Should have thrown");
			} catch (error: any) {
				expect(error.stderr).toContain("is prohibited");
				expect(error.stderr).toContain("Prohibited branch names:");
			}
		});

		it("should show helpful error for length violations", async () => {
			// Create custom config with strict length
			await fs.writeFile(CONFIG_FILE, `
				export default {
					branches: ["feature"],
					rules: {
						"branch-max-length": 10,
					},
				};
			`);
			
			await execAsync("git checkout -b feature-very-long-branch-name");
			
			try {
				await execAsync(`node ${CLI_PATH}`);
				expect.fail("Should have thrown");
			} catch (error: any) {
				expect(error.stderr).toContain("is too long");
				expect(error.stderr).toContain("maximum length: 10");
			}
		});
	});

	describe("Package.json configuration", () => {
		it("should read config from package.json", async () => {
			await fs.writeFile(path.join(TEST_DIR, "package.json"), JSON.stringify({
				name: "test-package",
				"elsikora": {
					"git-branch-lint": {
						branches: ["custom"],
						rules: {
							"branch-pattern": ":type/:name",
							"branch-subject-pattern": "[a-z-]+",
						},
					},
				},
			}, null, 2));

			await execAsync("git checkout -b custom/test");
			const { stdout, stderr } = await execAsync(`node ${CLI_PATH}`);
			
			expect(stderr).toBe("");
			expect(stdout).toBe("");
		});
	});
}); 