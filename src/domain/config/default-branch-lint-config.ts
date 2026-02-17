import type { IBranchLintConfig } from "../type/config.type";

const BRANCH_MAX_LENGTH: number = 50;
const BRANCH_MIN_LENGTH: number = 5;

export const DEFAULT_BRANCH_LINT_CONFIG: IBranchLintConfig = {
	branches: {
		bugfix: { description: "🐞 Fixing issues in existing functionality", title: "Bugfix" },
		feature: { description: "🆕 Integration of new functionality", title: "Feature" },
		hotfix: { description: "🚑 Critical fixes for urgent issues", title: "Hotfix" },
		release: { description: "📦 Preparing a new release version", title: "Release" },
		support: { description: "🛠️ Support and maintenance tasks", title: "Support" },
	},
	ignore: ["dev"],
	rules: {
		"branch-max-length": BRANCH_MAX_LENGTH,
		"branch-min-length": BRANCH_MIN_LENGTH,
		"branch-pattern": ":type/:ticket-:name",
		"branch-prohibited": ["main", "master", "release"],
		"branch-subject-pattern": "[a-z0-9-]+",
	},
};
