# themegen

Node.js + TypeScript CLI that generates platform-specific theme files (VSCode, iTerm2, Slack, Discord, Windows Terminal, Sublime, JetBrains) from a single canonical color schema. Uses `commander` for CLI parsing and `vitest` for tests.

## Quick Start

```bash
# Install dependencies
npm ci || npm install --no-fund --prefer-offline
```

```bash
# Build the TypeScript sources
npm run build
```

```bash
# Build + run the CLI in one step
npm run dev -- generate monokai-dark

# Or run directly after building
npm start -- list
npm start -- generate tango-light --output ./my-themes
npm start -- random
npm start -- validate monokai-dark
```

```bash
# Run tests
npm test
```

```bash
# Link globally as `themegen`
npm link
themegen generate monokai-dark
```
