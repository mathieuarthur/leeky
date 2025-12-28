<div align="center">

# 🥬 Leeky

### 🎮 LeekWars AI Management Tool

*Sync your code between LeekWars and your local workspace*

[![Made with Bun](https://img.shields.io/badge/Made%20with-Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/mathieuarthur/leeky/generate-workdir.yml?style=for-the-badge&logo=github-actions&logoColor=white&label=CI)](https://github.com/mathieuarthur/leeky/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![LeekWars](https://img.shields.io/badge/LeekWars-Ready-5CB85C?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==)](https://leekwars.com)

[![GitHub Stars](https://img.shields.io/github/stars/mathieuarthur/leeky?style=for-the-badge&logo=github&color=gold)](https://github.com/mathieuarthur/leeky/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/mathieuarthur/leeky?style=for-the-badge&logo=github&color=red)](https://github.com/mathieuarthur/leeky/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/mathieuarthur/leeky?style=for-the-badge&logo=github&color=purple)](https://github.com/mathieuarthur/leeky/pulls)

![Last Commit](https://img.shields.io/github/last-commit/mathieuarthur/leeky?style=flat-square&logo=git)
![Code Size](https://img.shields.io/github/languages/code-size/mathieuarthur/leeky?style=flat-square)
![Repo Size](https://img.shields.io/github/repo-size/mathieuarthur/leeky?style=flat-square)
![Maintenance](https://img.shields.io/maintenance/yes/2025?style=flat-square)

---

</div>

## ✨ Features

- 🚀 **Create**: Generate AIs and folders on LeekWars from your local `workdir/` structure
- 🗑️ **Delete**: Remove all AIs and folders from your LeekWars account ⚠️ **WARNING: This operation is irreversible!**
- 📥 **Workdir**: Download all your LeekWars code to local `workdir/` for editing
- 📤 **Save**: Upload modified code from `workdir/` back to LeekWars

## 🚀 Quick Start

**Prerequisites**: [Bun](https://bun.sh) installed

```bash
bun install
bun run start
```

The tool will prompt you to choose an operation (1-4).

## 📖 Usage

Run with a specific operation:

```bash
bun run start create   # Create AIs from workdir/
bun run start delete   # Delete all AIs ⚠️ WARNING: Irreversible!
bun run start workdir  # Download code to workdir/
bun run start save     # Upload code from workdir/
```

Or use numeric shortcuts:

```bash
bun run start 1  # create
bun run start 2  # delete ⚠️ WARNING: Irreversible!
bun run start 3  # workdir
bun run start 4  # save
```

## 📁 Project Structure

```
src/
  ├── index.ts              # Main CLI entry point
  └── functions/            # Core functionality
      ├── createAi.ts       # Create AIs and folders
      ├── deleteAi.ts       # Delete AIs and folders
      ├── getCode.ts        # Fetch code from LeekWars
      ├── saveCode.ts       # Upload code to LeekWars
      ├── workDir.ts        # Manage local workspace
      ├── login.ts          # Authentication
      └── getAiIdByName.ts  # AI lookup utilities

workdir/                    # Local workspace
  ├── *.leek               # Standalone AI files
  ├── behaviors/           # Organized code modules
  ├── entities/
  ├── functions/
  └── LeekMyData/          # Specific AI folders
```

## 🛠️ Development

Lint the code:

```bash
bun run lint       # Check for issues
bun run lint:fix   # Auto-fix issues
```

## 📝 Notes

- 🔐 Credentials are configured in `src/functions/login.ts` (consider using environment variables for security)
- 📂 The `workdir/` structure mirrors your LeekWars folder organization
- 📄 `.leek` files contain your AI code in the LeekScript language

---

<div align="center">

**⭐ Star this repo if you find it useful! ⭐**

Made with ❤️ for the [LeekWars](https://leekwars.com) community

</div>
