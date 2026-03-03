# CLAUDE.md — Project Instructions for AI Agents

## Project Overview

**themegen** is a background-only CLI Color / Theme Generator written in TypeScript. It has NO frontend, NO UI, NO React. It runs as a Node.js CLI tool that generates platform-specific theme/config files from a single canonical color schema.

## Tech Stack

- **Runtime:** Node.js (ES2022 modules)
- **Language:** TypeScript (strict mode)
- **CLI framework:** Commander
- **Module system:** ESM (`"type": "module"` in package.json)
- **Build:** `tsc` → `dist/`

## Project Structure

```
src/
├── index.ts              # CLI entry point — all commands defined here
├── types.ts              # BaseTheme, AnsiColors, Generator, and related types
├── themes/               # Base theme definitions (single source of truth)
│   ├── index.ts          # Theme registry — all themes registered here
│   ├── monokai-dark.ts
│   ├── monokai-light.ts
│   ├── tango-dark.ts
│   ├── tango-light.ts
│   ├── high-contrast-dark.ts
│   └── high-contrast-light.ts
├── generators/           # Platform-specific output generators
│   ├── index.ts          # Generator registry — all generators registered here
│   ├── slack.ts          # → slack.json
│   ├── discord.ts        # → discord.css
│   ├── windows-terminal.ts # → windows-terminal.json
│   ├── vscode.ts         # → vscode.json (includes tokenColors)
│   ├── iterm.ts          # → iterm.itermcolors (XML plist)
│   ├── sublime.ts        # → sublime.tmTheme (XML plist)
│   └── jetbrains.ts      # → jetbrains.icls (XML scheme)
└── utils/
    ├── color.ts          # hex/rgb/hsl conversion, WCAG, contrast, harmony, ANSI derivation
    ├── validation.ts     # Theme validation + WCAG contrast checking
    └── random.ts         # Random theme generation
```

## Key Architecture Rules

1. **All themes derive from `BaseTheme`** — defined in `src/types.ts`. Every generator receives a `BaseTheme` and maps its tokens to platform format.
2. **Generators are pure functions** — `(theme: BaseTheme) => GeneratorResult`. They return `{ filename, content }` and never perform I/O.
3. **Registries are the single point of entry** — `src/themes/index.ts` and `src/generators/index.ts` export the registries. New themes/generators must be added there.
4. **ESM imports require `.js` extensions** — all relative imports use `.js` suffix (TypeScript compiles `.ts` → `.js`).
5. **No interactive prompts** — the CLI is designed for non-interactive/CI usage. All input comes from CLI flags.

## Common Tasks

### Build
```sh
npm run build    # tsc → dist/
```

### Run CLI
```sh
node dist/index.js <command>
# or after npm link:
themegen <command>
```

### Add a New Theme
1. Create `src/themes/my-theme.ts` exporting a `BaseTheme` object
2. Import and register it in `src/themes/index.ts` (add to `themeRegistry` and the `export` line)
3. Rebuild with `npm run build`

### Add a New Generator
1. Create `src/generators/my-platform.ts` with `export function generateMyPlatformTheme(theme: BaseTheme): GeneratorResult`
2. Import and register it in `src/generators/index.ts` (add to `generatorRegistry` and the `export` line)
3. Rebuild with `npm run build`

## Code Conventions

- No default exports — use named exports everywhere
- Theme names use kebab-case: `monokai-dark`, `high-contrast-light`
- All colors are 6-digit hex with `#` prefix: `#ff0000`
- Generator output filenames match the platform name: `slack.json`, `vscode.json`, `iterm.itermcolors`
- Keep generators self-contained — each file handles its own format serialization (JSON, XML plist, CSS, etc.)
