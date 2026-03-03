# themegen

A background-only CLI Color / Theme Generator that creates platform-specific configuration files from a single canonical color schema.

No frontend. No UI. No React. Just a Node.js CLI tool.

## Supported Platforms

| Platform | Output File | Format |
|----------|-------------|--------|
| Slack | `slack.json` | JSON (sidebar theme + legacy comma-separated) |
| Discord | `discord.css` | CSS variables (BetterDiscord / Vencord) |
| Windows Terminal | `windows-terminal.json` | JSON color scheme fragment |
| VSCode | `vscode.json` | Full theme with editor colors + tokenColors |
| iTerm2 | `iterm.itermcolors` | XML plist |
| Sublime Text | `sublime.tmTheme` | XML plist (TextMate format) |
| JetBrains IDEs | `jetbrains.icls` | XML color scheme |

## Built-in Themes

| Theme | Mode | Description |
|-------|------|-------------|
| `monokai-dark` | dark | Classic Monokai with green/pink/blue syntax |
| `monokai-light` | light | Light variant of Monokai |
| `tango-dark` | dark | GNOME Tango palette on dark background |
| `tango-light` | light | GNOME Tango palette on light background |
| `high-contrast-dark` | dark | Pure black background, maximum contrast — all WCAG AA |
| `high-contrast-light` | light | Pure white background, maximum contrast — all WCAG AA |

## Installation

```sh
# Clone and install
git clone <repo-url> && cd color-gen
npm install
npm run build

# Link globally (optional)
npm link
```

## Usage

### Generate a theme

```sh
themegen generate monokai-dark
themegen generate tango-light --output ./my-themes
```

Output structure:

```
output/
└── monokai-dark/
    ├── slack.json
    ├── discord.css
    ├── windows-terminal.json
    ├── vscode.json
    ├── iterm.itermcolors
    ├── sublime.tmTheme
    └── jetbrains.icls
```

### List available themes and generators

```sh
themegen list
```

### Generate a random theme

```sh
themegen random
themegen random --output ./experiments
```

Produces a randomly generated theme with derived ANSI palette, harmony colors, and all platform files.

### Customize a theme

Override primary color, background, or toggle dark/light mode:

```sh
themegen customize monokai-dark --primary "#FF5500"
themegen customize tango-light --primary "#0066CC" --background "#FAFAFA"
themegen customize monokai-dark --primary "#E0E0E0" --mode light
```

Mode toggling recalculates text colors and re-derives the full ANSI palette.

### Export all platforms (alias)

```sh
themegen export-all monokai-dark
```

### Validate a theme

Run WCAG contrast validation and get a full contrast report:

```sh
themegen validate monokai-dark
```

Example output:

```
Validating: monokai-dark (dark)

  [WARN ] textSecondary: contrast ratio 3.03:1 fails WCAG AA (need 4.5:1)

Contrast report:
  textPrimary / background: 13.94:1 [AA]
  textSecondary / background: 3.03:1 [AA-large]
  textPrimary / surface: 10.27:1 [AA]
  primary / background: 9.58:1 [AA]
  accent / background: 3.93:1 [AA-large]
```

### Color harmony generator

Generate complementary, analogous, triadic, or split-complementary palettes:

```sh
themegen harmony "#a6e22e"
themegen harmony "#a6e22e" --type triadic
themegen harmony "#3465a4" --type analogous
themegen harmony "#f92672" --type split-complementary
```

### Global options

All generation commands accept:

| Flag | Description |
|------|-------------|
| `-o, --output <dir>` | Output directory (default: `output`) |
| `--primary <hex>` | Override primary color |
| `--background <hex>` | Override background color |
| `--mode <dark\|light>` | Force dark or light mode recalculation |

## How to Extend

### Adding a new base theme

1. Create `src/themes/my-theme.ts`:

```ts
import type { BaseTheme } from "../types.js";

export const myTheme: BaseTheme = {
  name: "my-theme",
  mode: "dark",
  colors: {
    background: "#1e1e1e",
    surface: "#2d2d2d",
    primary: "#569cd6",
    secondary: "#4ec9b0",
    accent: "#c586c0",
    textPrimary: "#d4d4d4",
    textSecondary: "#808080",
    success: "#6a9955",
    warning: "#dcdcaa",
    error: "#f44747",
    ansi: {
      black: "#1e1e1e",
      red: "#f44747",
      green: "#6a9955",
      yellow: "#dcdcaa",
      blue: "#569cd6",
      magenta: "#c586c0",
      cyan: "#4ec9b0",
      white: "#d4d4d4",
      brightBlack: "#808080",
      brightRed: "#f44747",
      brightGreen: "#6a9955",
      brightYellow: "#dcdcaa",
      brightBlue: "#569cd6",
      brightMagenta: "#c586c0",
      brightCyan: "#4ec9b0",
      brightWhite: "#ffffff",
    },
  },
};
```

2. Register in `src/themes/index.ts`:

```ts
import { myTheme } from "./my-theme.js";

// Add to themeRegistry:
"my-theme": myTheme,

// Add to the export line:
export { ..., myTheme };
```

3. Rebuild: `npm run build`

### Adding a new platform generator

1. Create `src/generators/my-platform.ts`:

```ts
import type { BaseTheme, GeneratorResult } from "../types.js";

export function generateMyPlatformTheme(theme: BaseTheme): GeneratorResult {
  const { colors, name, mode } = theme;

  // Map BaseTheme tokens to your platform's format
  const config = {
    themeName: name,
    bg: colors.background,
    fg: colors.textPrimary,
    // ... platform-specific mappings
  };

  return {
    filename: "my-platform.json",
    content: JSON.stringify(config, null, 2),
  };
}
```

2. Register in `src/generators/index.ts`:

```ts
import { generateMyPlatformTheme } from "./my-platform.js";

// Add to generatorRegistry:
"my-platform": generateMyPlatformTheme,

// Add to the export line:
export { ..., generateMyPlatformTheme };
```

3. Rebuild: `npm run build`

## CI / Scripting

themegen is designed for non-interactive usage:

```sh
# Generate all themes in CI
for theme in monokai-dark monokai-light tango-dark tango-light high-contrast-dark high-contrast-light; do
  themegen generate "$theme" --output ./dist/themes
done

# Validate all themes
for theme in monokai-dark monokai-light tango-dark tango-light high-contrast-dark high-contrast-light; do
  themegen validate "$theme"
done
```

## Publishing as NPM Package

```sh
npm publish
```

The `bin` field in `package.json` is already configured. Users will get `themegen` on their PATH after `npm install -g themegen`.

## Bundling as a Single Executable

```sh
# Bundle with esbuild
npx esbuild dist/index.js --bundle --platform=node --outfile=themegen.cjs

# Or use Node.js Single Executable Application (Node 20+)
# See: https://nodejs.org/api/single-executable-applications.html
```

## Architecture

```
BaseTheme (single source of truth)
    │
    ├── generators/slack.ts        → slack.json
    ├── generators/discord.ts      → discord.css
    ├── generators/windows-terminal.ts → windows-terminal.json
    ├── generators/vscode.ts       → vscode.json
    ├── generators/iterm.ts        → iterm.itermcolors
    ├── generators/sublime.ts      → sublime.tmTheme
    └── generators/jetbrains.ts    → jetbrains.icls
```

Every generator is a pure function: `(BaseTheme) → { filename, content }`. Generators never perform I/O — the CLI handles file writing. This makes them testable, composable, and easy to extend.

## Color Utilities

Available in `src/utils/color.ts`:

- **Conversion:** `hexToRgb`, `rgbToHex`, `rgbToHsl`, `hslToRgb`, `hexToHsl`, `hslToHex`
- **WCAG:** `relativeLuminance`, `contrastRatio`, `wcagCheck`
- **Manipulation:** `lighten`, `darken`, `adjustHue`, `desaturate`
- **Harmony:** `generateHarmony` (complementary, analogous, triadic, split-complementary)
- **ANSI:** `deriveAnsiPalette` — auto-generates a 16-color ANSI palette from primary + background + mode

## License

MIT
