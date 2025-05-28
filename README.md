<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/git-branch-lint-0rauIZprtXnHOrt840ZtTzrUK32erg.png" width="500" alt="project-logo">
</p>

<h1 align="center">Git Branch Lint 🌿</h1>
<p align="center"><em>Enforce consistent git branch naming conventions across your projects</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/version-blue.svg?style=for-the-badge&logo=npm&logoColor=white" alt="version"> <img src="https://img.shields.io/badge/typescript-blue.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript"> <img src="https://img.shields.io/badge/license-green.svg?style=for-the-badge&logo=license&logoColor=white" alt="license"> <img src="https://img.shields.io/badge/node-green.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="node">
</p>


## 📚 Table of Contents
- [Description](#-description)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [License](#-license)


## 📖 Description
Git Branch Lint is a powerful tool designed to maintain consistent git branch naming conventions in your development workflow. It helps teams enforce standardized branch naming patterns, prevent common naming mistakes, and maintain a clean git history. Built with TypeScript and following clean architecture principles, it provides flexible configuration options and helpful error messages to guide developers in following your team's branch naming conventions.

## 🚀 Features
- ✨ **🔍 Validates branch names against customizable patterns**
- ✨ **⚡ Fast and lightweight with minimal dependencies**
- ✨ **🛠 Flexible configuration through multiple formats (JS, JSON, YAML)**
- ✨ **💡 Helpful error messages with suggestions for fixing invalid names**
- ✨ **🔒 Prevents usage of prohibited branch names**
- ✨ **📏 Configurable length restrictions for branch names**
- ✨ **🎨 Colored CLI output for better readability**
- ✨ **🔧 Easy integration with git hooks and CI/CD pipelines**

## 🛠 Installation
```bash
# Using npm
npm install --save-dev @elsikora/git-branch-lint

# Using yarn
yarn add -D @elsikora/git-branch-lint

# Using pnpm
pnpm add -D @elsikora/git-branch-lint
```

## 💡 Usage
## Basic Usage

Run the linter directly:
```bash
npx @elsikora/git-branch-lint
```

## Configuration

Create a configuration file `.elsikora/.git-branch-lintrc.json`:
```json
{
  "pattern": ":type/:name",
  "params": {
    "type": ["feature", "bugfix", "hotfix", "release"],
    "name": ["[a-z0-9-]+"]
  },
  "prohibited": ["master", "main", "develop"],
  "minLength": 5,
  "maxLength": 50
}
```

## Git Hooks Integration

Add to your `package.json`:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npx @elsikora/git-branch-lint"
    }
  }
}
```

## Advanced Usage

Custom configuration in JavaScript (`.elsikora/git-branch-lint.config.js`):
```javascript
module.exports = {
  branches: {
		bugfix: { description: "🐞 Fixing issues in existing functionality", title: "Bugfix" },
		feature: { description: "🆕 Integration of new functionality", title: "Feature" },
		hotfix: { description: "🚑 Critical fixes for urgent issues", title: "Hotfix" },
		release: { description: "📦 Preparing a new release version", title: "Release" },
		support: { description: "🛠️ Support and maintenance tasks", title: "Support" },
	},
	ignore: ["dev"],
	rules: {
		"branch-max-length": 50,
		"branch-min-length": 5,
		"branch-pattern": ":type/:name",
		"branch-prohibited": ["main", "master", "release"],
		"branch-subject-pattern": "[a-z0-9-]+",
	},
}
```

Typescript support (`.elsikora/git-branch-lint.config.ts`):
```typescript
import type { BranchLintConfig } from "@elsikora/git-branch-lint";

const config: BranchLintConfig = {
 branches: {
  bugfix: { description: "🆕 Integration of new functionality", title: "Feature" },
  feature: { description: "🐞 Fixing issues in existing functionality", title: "Bugfix" },
  hotfix: { description: "🚑 Critical fixes for urgent issues", title: "Hotfix" },
  release: { description: "📦 Preparing a new release version", title: "Release" },
  support: { description: "🛠️ Support and maintenance tasks", title: "Support" },
 },
 ignore: [dev],
 rules: {
  "branch-max-length": 50,
  "branch-min-length": 5,
  "branch-pattern": ":type/:name",
  "branch-prohibited": ["main", "master", "release"],
  "branch-subject-pattern": "[a-z0-9-]+",
 },
};

export default config;
```

## Create branch tool

Create branch tool is a command-line utility included in the @elsikora/branch-lint package. It facilitates the creation of Git branches by guiding users through an interactive prompt to select a branch type and name, ensuring compliance with the project's branch naming conventions as defined in the configuration.

Example:
```bash
npx @elsikora/branch-lint -b
```

Prompts:
```bash
🌿 Creating a new branch...

❔ Select the type of branch you're creating: 
  Feature:     🆕 Integration of new functionality 
  Bugfix:      🐞 Fixing issues in existing functionality 
❯ Hotfix:      🚑 Critical fixes for urgent issues 
  Release:     📦 Preparing a new release version 
  Support:     🛠️ Support and maintenance tasks 

Enter the branch name (e.g., authorization): new-ui

⌛️ Creating branch: feature/new-ui
Do you want to push the branch to the remote repository? (y/N) y

✅ Branch feature/new-ui pushed to remote repository!
```

## CI/CD Integration

GitHub Actions example:
```yaml
name: Lint Branch Names
on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npx @elsikora/git-branch-lint
```

## 🛣 Roadmap
| Task / Feature | Status |
|---------------|--------|
| - Add support for custom error messages | 🚧 In Progress |
| - Implement branch name suggestions when validation fails | 🚧 In Progress |
| - Add support for regex-based branch name validation | 🚧 In Progress |
| - Create GitHub Action for easier CI integration | 🚧 In Progress |
| - Add support for branch name templates | 🚧 In Progress |
| - Implement branch name statistics and reporting | 🚧 In Progress |
| (done) 🔍 Validates branch names against customizable patterns | 🚧 In Progress |
| (done) ⚡ Fast and lightweight with minimal dependencies | 🚧 In Progress |
| (done) 🛠 Flexible configuration through multiple formats (JS, JSON, YAML) | 🚧 In Progress |

## ❓ FAQ
### Why should I use Git Branch Lint?
Maintaining consistent branch naming conventions helps teams track work effectively and automate processes like deployment and versioning.

### Can I use custom regular expressions?
Yes, you can define custom regex patterns in the configuration file's `params` section.

### How do I skip validation for certain branches?
You can exclude branches by adding them to the `prohibited` list with a negative pattern.

### Does it work with monorepos?
Yes, you can configure different patterns for different parts of your monorepo using workspace-specific configuration files.

## 🔒 License
This project is licensed under **MIT License

Copyright (c) 2025 ElsiKora

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.**.
