<p align="center">
  <img src="https://6jft62zmy9nx2oea.public.blob.vercel-storage.com/git-branch-lint-myXi2xH8jqeEIqScu1S9NymOOJVD9I.png" width="500" alt="project-logo">
</p>

<h1 align="center">🌿 Git-Branch-Lint</h1>
<p align="center"><em>Enforce consistent Git branch naming conventions with style and ease</em></p>

<p align="center">
    <a aria-label="ElsiKora logo" href="https://elsikora.com">
  <img src="https://img.shields.io/badge/MADE%20BY%20ElsiKora-333333.svg?style=for-the-badge" alt="ElsiKora">
</a> <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"> <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"> <img src="https://img.shields.io/badge/npm-CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="npm"> <img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"> <img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier"> <img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest"> <img src="https://img.shields.io/badge/Rollup-EC4A3F.svg?style=for-the-badge&logo=rollup&logoColor=white" alt="Rollup"> <img src="https://img.shields.io/badge/Git-F05032.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git"> <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions">
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
Git-Branch-Lint is a powerful, TypeScript-based CLI tool that brings order to your Git workflow by enforcing consistent branch naming conventions across your entire development team. Built with clean architecture principles, it not only validates branch names but also provides an interactive branch creation wizard that guides developers through creating properly formatted branches. Whether you're managing a small project or a large enterprise codebase, Git-Branch-Lint helps maintain a clean, organized repository structure that makes tracking features, fixes, and releases effortless. It seamlessly integrates with Git hooks, CI/CD pipelines, and supports multiple configuration formats, making it the perfect addition to any modern development workflow.

## 🚀 Features
- ✨ **🎯 **Smart Pattern Matching** - Define flexible branch naming patterns using simple placeholders like `:type/:name` that automatically validate against your configured branch types**
- ✨ **🚀 **Interactive Branch Creation** - Built-in wizard guides you through creating branches with beautiful prompts, ensuring compliance before the branch is even created**
- ✨ **🛡️ **Prohibited Branch Protection** - Prevent accidental use of protected branch names like 'main', 'master', or any custom prohibited names you define**
- ✨ **📏 **Length Validation** - Set minimum and maximum length constraints to keep branch names concise and meaningful**
- ✨ **🎨 **Beautiful CLI Output** - Colored terminal output with helpful error messages and hints that guide developers to fix issues quickly**
- ✨ **⚙️ **Flexible Configuration** - Support for multiple config formats (JS, TS, JSON, YAML) with intelligent config discovery via cosmiconfig**
- ✨ **🔄 **Git Hooks Ready** - Seamlessly integrate with Husky, lint-staged, or any Git hook manager for automatic validation**
- ✨ **📦 **Zero Config Option** - Works out of the box with sensible defaults while allowing complete customization when needed**
- ✨ **🏗️ **Clean Architecture** - Built with Domain-Driven Design principles, making the codebase maintainable and extensible**

## 🛠 Installation
```bash
## 📦 Installation

Install Git-Branch-Lint as a development dependency in your project:


# Using npm
npm install --save-dev @elsikora/git-branch-lint

# Using yarn
yarn add -D @elsikora/git-branch-lint

# Using pnpm
pnpm add -D @elsikora/git-branch-lint

# Using bun
bun add -d @elsikora/git-branch-lint


### Global Installation

For system-wide usage across multiple projects:


npm install -g @elsikora/git-branch-lint
```

## 💡 Usage
## 🚀 Usage

### Basic Branch Validation

Validate your current Git branch name:

```bash
npx @elsikora/git-branch-lint
```

### Interactive Branch Creation

Create a new branch with the interactive wizard:

```bash
npx @elsikora/git-branch-lint -b
# or
npx @elsikora/git-branch-lint --branch
```

### Configuration

Git-Branch-Lint uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file discovery. Create any of these files:

#### JavaScript Configuration (`.elsikora/git-branch-lint.config.js`)

```javascript
export default {
  branches: {
    feature: { 
      title: "Feature", 
      description: "🆕 New functionality" 
    },
    bugfix: { 
      title: "Bugfix", 
      description: "🐛 Bug fixes" 
    },
    hotfix: { 
      title: "Hotfix", 
      description: "🚑 Urgent production fixes" 
    },
    release: { 
      title: "Release", 
      description: "📦 Release preparation" 
    },
    chore: { 
      title: "Chore", 
      description: "🔧 Maintenance tasks" 
    }
  },
  ignore: ["dev", "develop", "staging"],
  rules: {
    "branch-pattern": ":type/:name",
    "branch-subject-pattern": "[a-z0-9-]+",
    "branch-prohibited": ["main", "master", "prod"],
    "branch-min-length": 5,
    "branch-max-length": 60
  }
};
```

#### TypeScript Configuration (`.elsikora/git-branch-lint.config.ts`)

```typescript
import type { IBranchLintConfig } from '@elsikora/git-branch-lint';

const config: IBranchLintConfig = {
  branches: {
    feat: { title: "Feature", description: "✨ New features" },
    fix: { title: "Fix", description: "🐛 Bug fixes" },
    docs: { title: "Docs", description: "📚 Documentation" },
    style: { title: "Style", description: "💄 Styling" },
    refactor: { title: "Refactor", description: "♻️ Code refactoring" },
    perf: { title: "Performance", description: "⚡ Performance improvements" },
    test: { title: "Test", description: "✅ Testing" },
    build: { title: "Build", description: "📦 Build system" },
    ci: { title: "CI", description: "👷 CI/CD" }
  },
  rules: {
    "branch-pattern": ":type/:name",
    "branch-subject-pattern": "[a-z0-9-]+",
    "branch-min-length": 8,
    "branch-max-length": 72
  }
};

export default config;
```

#### Package.json Configuration

```json
{
  "elsikora": {
    "git-branch-lint": {
      "branches": ["feature", "bugfix", "hotfix"],
      "rules": {
        "branch-pattern": ":type/:name",
        "branch-prohibited": ["main", "master"]
      }
    }
  }
}
```

### Git Hooks Integration

#### With Husky

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky init

# Add pre-push hook
echo "npx @elsikora/git-branch-lint" > .husky/pre-push
```

#### With lint-staged

```javascript
// lint-staged.config.js
export default {
  '*': () => 'npx @elsikora/git-branch-lint'
};
```

### CI/CD Integration

#### GitHub Actions

```yaml
name: Branch Lint
on: [push, pull_request]

jobs:
  lint-branch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx @elsikora/git-branch-lint
```

#### GitLab CI

```yaml
branch-lint:
  stage: test
  script:
    - npm ci
    - npx @elsikora/git-branch-lint
  only:
    - branches
```

### Advanced Patterns

#### Jira Integration Pattern

```javascript
{
  rules: {
    "branch-pattern": ":type/:ticket-:description",
    "branch-subject-pattern": {
      "ticket": "[a-z]{2,}-[0-9]+",
      "description": "[a-z0-9-]+"
    }
  }
}
// Valid: feature/proj-123-user-authentication
```

#### Monorepo Pattern

```javascript
{
  rules: {
    "branch-pattern": ":scope/:type/:name",
    "branch-subject-pattern": {
      "scope": "(web|api|shared|docs)",
      "type": "(feat|fix|chore)",
      "name": "[a-z0-9-]+"
    }
  }
}
// Valid: web/feat/shopping-cart
```

## 🛣 Roadmap
| Task / Feature | Status |
|----------------|--------|
| Core branch validation engine | ✅ Done |
| Interactive branch creation wizard | ✅ Done |
| Multiple configuration format support | ✅ Done |
| TypeScript support | ✅ Done |
| Comprehensive test coverage | ✅ Done |
| VS Code extension | 🚧 In Progress |
| Branch name auto-suggestions | 🚧 In Progress |
| Custom validation rules plugin system | 🚧 In Progress |
| Branch naming statistics dashboard | 🚧 In Progress |
| Integration with popular Git GUIs | 🚧 In Progress |
| AI-powered branch name generator | 🚧 In Progress |

## ❓ FAQ
## ❓ Frequently Asked Questions

### **Q: Can I use this with existing branches?**
A: Yes! The `ignore` configuration option allows you to exclude existing branches from validation. This is perfect for grandfathering in old branches while enforcing rules on new ones.

### **Q: How do I handle different patterns for different teams?**
A: You can create team-specific configuration files and use environment variables or Git config to load the appropriate one:
```bash
GIT_BRANCH_LINT_CONFIG=.team-frontend.config.js npx @elsikora/git-branch-lint
```

### **Q: Can I validate branch names in my IDE?**
A: While we're working on official IDE extensions, you can configure your IDE to run the validation as an external tool or use it with pre-commit hooks.

### **Q: What happens if I try to push an invalid branch?**
A: When integrated with Git hooks, the push will be prevented and you'll see a helpful error message explaining what's wrong and how to fix it.

### **Q: Can I use custom regex patterns?**
A: Absolutely! The `branch-subject-pattern` rule accepts any valid JavaScript regex pattern, giving you complete control over validation.

### **Q: Is this compatible with Git Flow or GitHub Flow?**
A: Yes! The default configuration works well with both workflows, and you can easily customize it to match your specific flow requirements.

### **Q: How do I migrate from other branch linting tools?**
A: Git-Branch-Lint's configuration is designed to be intuitive. Most configurations from other tools can be adapted by mapping their patterns to our rule system.

## 🔒 License
This project is licensed under **MIT License - see the [LICENSE](LICENSE) file for details.

Maintained with ❤️ by [ElsiKora](https://github.com/ElsiKora)**.
