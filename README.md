<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/git-branch-lint-myXi2xH8jqeEIqScu1S9NymOOJVD9I.png" width="500" alt="project-logo" />
</p>

<h1 align="center">Git-Branch-Lint</h1>
<p align="center"><em>CLI tool for consistent, enforceable Git branch naming.</em></p>

## Table Of Contents

- [Description](#description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Clean Architecture Rules](#clean-architecture-rules)
- [Development](#development)
- [License](#license)

## Description

`@elsikora/git-branch-lint` validates branch names against team rules and includes an interactive branch-creation flow.

The project follows layered clean architecture:

- `domain` - business rules, entities, policies, contracts
- `application` - use cases and orchestration logic
- `infrastructure` - adapters (git, config loading)
- `presentation` - CLI controllers, prompts, formatters

## Features

- Template-driven branch validation using placeholders (for example `:type/:name` or `:scope/:type/:description`).
- Optional ticket-id support with pattern `:type/:ticket-:name` (ticket part can be omitted).
- Interactive branch creation command (`-b` / `--branch`) built directly from configured placeholders.
- Branch constraints: prohibited names, min/max length, subject regex.
- Helpful CLI error/hint formatting.
- Cosmiconfig-based configuration discovery.

## Installation

Install as a dev dependency:

```bash
npm install --save-dev @elsikora/git-branch-lint
```

Or with other package managers:

```bash
yarn add -D @elsikora/git-branch-lint
pnpm add -D @elsikora/git-branch-lint
bun add -d @elsikora/git-branch-lint
```

## Usage

Validate current branch:

```bash
npx @elsikora/git-branch-lint
```

Start interactive branch creation:

```bash
npx @elsikora/git-branch-lint -b
# or
npx @elsikora/git-branch-lint --branch
```

Behavior notes:

- When `:ticket` is present in `branch-pattern`, both forms are valid:
  - with ticket: `feature/proj-123-user-authentication`
  - without ticket: `feature/user-authentication`
- Interactive prompt normalizes ticket-id to lowercase before branch creation.
- Placeholder prompts are generated from `branch-pattern` in declared order.
- Validation and branch creation use the same template/pattern rules.

## Configuration

Configuration is loaded via `cosmiconfig` (for example `package.json`, `.elsikora/git-branch-lint.config.js`, `.elsikora/git-branch-lint.config.ts`).

Rule semantics:

- `branch-pattern` defines placeholders with `:placeholder` tokens.
- Placeholder naming supports lowercase letters, digits, and hyphens (for example `:jira-ticket`).
- `:type` is validated against configured `branches`.
- `branch-subject-pattern` supports:
  - `string` - shared regex for all non-`type` placeholders.
  - `object` - regex per placeholder key (for example `scope`, `description`, `ticket`).
- Optional placeholders are supported when the token is followed by `-` in `branch-pattern` (for example `:ticket-`).
- Before branch creation, the final assembled name is validated again with full lint rules.

### JavaScript Example

```javascript
export default {
	branches: {
		feature: { title: "Feature", description: "New functionality" },
		bugfix: { title: "Bugfix", description: "Bug fixes" },
		hotfix: { title: "Hotfix", description: "Urgent fixes" },
	},
	ignore: ["dev"],
	rules: {
		"branch-pattern": ":type/:ticket-:name",
		"branch-subject-pattern": "[a-z0-9-]+",
		"branch-prohibited": ["main", "master", "release"],
		"branch-min-length": 5,
		"branch-max-length": 50,
	},
};
```

### Advanced Placeholder Example

```javascript
export default {
	branches: ["feat", "fix", "chore"],
	rules: {
		"branch-pattern": ":scope/:type/:description",
		"branch-subject-pattern": {
			scope: "(web|api|shared)",
			description: "[a-z0-9-]+",
		},
	},
};
```

Valid branch example: `web/feat/shopping-cart`.

### TypeScript Example

```typescript
import type { IBranchLintConfig } from "@elsikora/git-branch-lint";

const config: IBranchLintConfig = {
	branches: {
		feature: { title: "Feature", description: "New functionality" },
		bugfix: { title: "Bugfix", description: "Bug fixes" },
		hotfix: { title: "Hotfix", description: "Urgent fixes" },
	},
	ignore: ["dev"],
	rules: {
		"branch-pattern": ":type/:ticket-:name",
		"branch-subject-pattern": "[a-z0-9-]+",
		"branch-prohibited": ["main", "master", "release"],
		"branch-min-length": 5,
		"branch-max-length": 50,
	},
};

export default config;
```

### `package.json` Example

```json
{
	"elsikora": {
		"git-branch-lint": {
			"branches": ["feature", "bugfix", "hotfix"],
			"rules": {
				"branch-pattern": ":type/:ticket-:name",
				"branch-subject-pattern": "[a-z0-9-]+",
				"branch-prohibited": ["main", "master", "release"]
			}
		}
	}
}
```

## Clean Architecture Rules

Repository standards enforced in this codebase:

- Business rules live in `domain` and are consumed via `application` use cases.
- `presentation` does I/O only; it must not own business validation rules.
- `infrastructure` contains adapters only; default domain rules are defined outside adapter implementation.
- `application` depends on domain contracts, not concrete infrastructure classes.
- Types/interfaces are extracted into dedicated type/interface files for reusable contracts.
- Import order and class member ordering are lint-enforced and must remain consistent.

## Development

Common scripts:

```bash
npm run lint
npm run lint:types
npm run test:unit
npm run test:e2e
```

## License

MIT. See [`LICENSE`](LICENSE).
