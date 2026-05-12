# themegen — Architecture

## High-Level Overview

themegen is a Node.js CLI (TypeScript, ESM) that generates platform-specific
theme/config files from a single canonical color schema. One base theme — a
`BaseTheme` with semantic slots (`background`, `surface`, `primary`,
`secondary`, `accent`, `textPrimary`, `textSecondary`, `success`, `warning`,
`error`) plus a 16-color ANSI palette — fans out into per-target output files
written to a chosen directory.

Targets (one generator each):

- Slack (sidebar theme string)
- Discord (CSS variables / userstyle)
- Windows Terminal (`settings.json` scheme fragment)
- VS Code (`color-theme.json`)
- iTerm2 (`.itermcolors` plist)
- Sublime Text (`.sublime-color-scheme`)
- JetBrains IDEs (`.icls` color scheme)

The CLI is built on `commander` and exposes `generate`, `list`, `random`,
`customize`, `export-all`, `validate`, and `harmony` subcommands. Color
operations (lighten/darken, ANSI derivation, WCAG contrast, harmony) live in a
small util layer with no runtime deps beyond `commander`.

Distribution: published as the `themegen` npm bin (`dist/index.js`), and as
tar.gz / zip artifacts attached to GitHub Releases by the Release workflow.

## Key Directories

- `src/` — TypeScript sources, ESM (`"type": "module"`, `.js` import
  specifiers required by NodeNext resolution).
- `src/generators/` — one file per output target; each exports a
  `Generator: (theme) => { filename, content }`. `index.ts` holds the
  `generatorRegistry` and `runAllGenerators` fan-out.
- `src/themes/` — built-in `BaseTheme` definitions (Monokai dark/light, Tango
  dark/light, High-Contrast dark/light). `index.ts` exposes the
  `themeRegistry` and `getTheme`/`listThemes` lookups.
- `src/utils/` — pure helpers: `color.ts` (hex/RGB/HSL conversion, lighten,
  darken, WCAG contrast, ANSI palette derivation, harmony), `validation.ts`
  (theme shape + contrast warnings), `random.ts` (random theme synthesis).
- `src/__tests__/` — Vitest unit tests for color math and validation.
- `.github/workflows/` — CI, PR checks, build, and release workflows.
- `dist/` — `tsc` build output (gitignored). The `bin` entry points here.

## Important Files

- `src/index.ts` — CLI entrypoint (`#!/usr/bin/env node`). Wires commander
  commands to theme lookup, override application (`applyOverrides`),
  validation, and `writeThemeFiles` (which calls `runAllGenerators` and
  writes one file per target into `output/<theme-name>/`).
- `src/types.ts` — central type definitions: `BaseTheme`, `AnsiColors`,
  `ThemeOverrides`, `Generator`, `GeneratorResult`, `WcagResult`,
  `HarmonyType`. The whole codebase pivots on `BaseTheme`.
- `src/generators/index.ts` — generator registry; the single place to add a
  new output target.
- `src/themes/index.ts` — theme registry; the single place to add a new base
  theme.
- `src/utils/color.ts` — color math used by overrides, ANSI derivation, and
  the `harmony` / `validate` commands.
- `src/utils/validation.ts` — `validateTheme` returns `{ severity, message }`
  issues; errors abort `generate`, warnings are surfaced and ignored.
- `package.json` — declares the `themegen` bin, `tsc` build, `vitest` test
  runner, and the single runtime dep (`commander`).
- `tsconfig.json` — ESM / NodeNext settings; emits to `dist/`.
- `format.sh` — local formatter wrapper.
- `.github/workflows/ci.yml` — build check on pushes to `main`/`master`.
- `.github/workflows/pr.yml` — PR validation.
- `.github/workflows/build.yml` — standalone build job.
- `.github/workflows/release.yml` — manual `workflow_dispatch` release.

## Build & Release Flow

Build:

1. `npm ci` (or `npm install`) installs `commander` + dev deps.
2. `npm run build` runs `tsc` per `tsconfig.json`, emitting ESM JS to
   `dist/`. The shebang on `src/index.ts` survives so `dist/index.js` is
   directly executable as the `themegen` bin.
3. `npm test` runs Vitest against `src/__tests__/`.

CI (`.github/workflows/ci.yml`, `pr.yml`, `build.yml`):

- Node 20 on `ubuntu-latest`.
- `actions/checkout@v6` + `actions/setup-node@v6` with npm cache.
- `npm ci` then `npm run build`. Test job runs Vitest where wired.

Release (`.github/workflows/release.yml`):

- `workflow_dispatch` only, with required `tag` input (e.g. `v1.0.2`) and
  optional `notes`. The workflow does NOT derive the tag from
  `github.ref_name` — the `tag` input is mandatory.
- Steps: checkout → setup Node 20 → `npm ci || npm install
  --no-fund --prefer-offline` → `npm run build` → package `dist/` as both
  `themegen-<tag>-dist.tar.gz` and `themegen-<tag>-dist.zip` under
  `release-artifacts/` → `softprops/action-gh-release@v2` publishes a
  GitHub Release at `tag_name = inputs.tag` with those artifacts attached.
- `permissions: contents: write` scoped to the release job only.
