#!/usr/bin/env node

import { Command } from "commander";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

import type { BaseTheme, ThemeOverrides } from "./types.js";
import { getTheme, listThemes, themeRegistry } from "./themes/index.js";
import {
  runAllGenerators,
  generatorRegistry,
  listGenerators,
} from "./generators/index.js";
import { validateTheme } from "./utils/validation.js";
import { generateRandomTheme } from "./utils/random.js";
import {
  lighten,
  darken,
  deriveAnsiPalette,
  wcagCheck,
  generateHarmony,
  contrastRatio,
} from "./utils/color.js";
import type { HarmonyType } from "./types.js";

const program = new Command();

program
  .name("themegen")
  .description("CLI Color / Theme Generator — generate platform-specific theme files")
  .version("1.0.0");

// --- Helpers ---

function applyOverrides(theme: BaseTheme, overrides: ThemeOverrides): BaseTheme {
  const copy: BaseTheme = JSON.parse(JSON.stringify(theme));

  if (overrides.primary) {
    copy.colors.primary = overrides.primary;
  }
  if (overrides.background) {
    copy.colors.background = overrides.background;
    copy.colors.surface =
      copy.mode === "dark"
        ? lighten(overrides.background, 0.05)
        : darken(overrides.background, 0.03);
  }
  if (overrides.mode && overrides.mode !== copy.mode) {
    copy.mode = overrides.mode;
    // Recalculate text colors for new mode
    if (overrides.mode === "dark") {
      copy.colors.textPrimary = "#f0f0f0";
      copy.colors.textSecondary = "#a0a0a0";
      if (!overrides.background) {
        copy.colors.background = darken(copy.colors.background, 0.4);
        copy.colors.surface = lighten(copy.colors.background, 0.05);
      }
    } else {
      copy.colors.textPrimary = "#1a1a1a";
      copy.colors.textSecondary = "#555555";
      if (!overrides.background) {
        copy.colors.background = lighten(copy.colors.background, 0.4);
        copy.colors.surface = darken(copy.colors.background, 0.03);
      }
    }
    // Re-derive ANSI
    copy.colors.ansi = deriveAnsiPalette(
      copy.colors.primary,
      copy.colors.background,
      copy.mode
    );
  }

  return copy;
}

function writeThemeFiles(theme: BaseTheme, outputDir: string): void {
  const themeDir = join(outputDir, theme.name);
  mkdirSync(themeDir, { recursive: true });

  const results = runAllGenerators(theme);
  for (const result of results) {
    const filePath = join(themeDir, result.filename);
    writeFileSync(filePath, result.content, "utf-8");
  }

  console.log(`Generated ${results.length} files in ${themeDir}/`);
  for (const r of results) {
    console.log(`  ${r.filename}`);
  }
}

// --- Commands ---

program
  .command("generate <theme>")
  .description("Generate all platform themes for a base theme")
  .option("-o, --output <dir>", "Output directory", "output")
  .option("--primary <color>", "Override primary color (hex)")
  .option("--background <color>", "Override background color (hex)")
  .option("--mode <mode>", "Force dark or light mode")
  .action((themeName: string, opts) => {
    let theme = getTheme(themeName);
    if (!theme) {
      console.error(`Unknown theme: "${themeName}". Use "themegen list" to see available themes.`);
      process.exit(1);
    }

    theme = applyOverrides(theme, {
      primary: opts.primary,
      background: opts.background,
      mode: opts.mode,
    });

    const issues = validateTheme(theme);
    const errors = issues.filter((i) => i.severity === "error");
    if (errors.length > 0) {
      console.error("Theme validation errors:");
      errors.forEach((e) => console.error(`  ${e.message}`));
      process.exit(1);
    }
    const warnings = issues.filter((i) => i.severity === "warning");
    if (warnings.length > 0) {
      warnings.forEach((w) => console.warn(`  warning: ${w.message}`));
    }

    writeThemeFiles(theme, resolve(opts.output));
  });

program
  .command("list")
  .description("List available base themes and generators")
  .action(() => {
    console.log("Base themes:");
    for (const name of listThemes()) {
      const t = themeRegistry[name];
      console.log(`  ${name} (${t.mode})`);
    }
    console.log("\nGenerators:");
    for (const name of listGenerators()) {
      console.log(`  ${name}`);
    }
  });

program
  .command("random")
  .description("Generate a random theme")
  .option("-o, --output <dir>", "Output directory", "output")
  .action((opts) => {
    const theme = generateRandomTheme();
    console.log(`Generated random theme: ${theme.name} (${theme.mode})`);
    console.log(`  primary:    ${theme.colors.primary}`);
    console.log(`  background: ${theme.colors.background}`);
    console.log(`  accent:     ${theme.colors.accent}`);
    writeThemeFiles(theme, resolve(opts.output));
  });

program
  .command("customize <theme>")
  .description("Generate a customized version of a base theme")
  .requiredOption("--primary <color>", "Primary color override (hex)")
  .option("--background <color>", "Background color override (hex)")
  .option("--mode <mode>", "Force dark or light mode")
  .option("-o, --output <dir>", "Output directory", "output")
  .action((themeName: string, opts) => {
    let theme = getTheme(themeName);
    if (!theme) {
      console.error(`Unknown theme: "${themeName}". Use "themegen list" to see available themes.`);
      process.exit(1);
    }

    theme = applyOverrides(theme, {
      primary: opts.primary,
      background: opts.background,
      mode: opts.mode,
    });

    // Rename to indicate customization
    theme.name = `${theme.name}-custom`;
    writeThemeFiles(theme, resolve(opts.output));
  });

program
  .command("export-all <theme>")
  .description("Export all platform configs for a theme (alias for generate)")
  .option("-o, --output <dir>", "Output directory", "output")
  .action((themeName: string, opts) => {
    const theme = getTheme(themeName);
    if (!theme) {
      console.error(`Unknown theme: "${themeName}".`);
      process.exit(1);
    }
    writeThemeFiles(theme, resolve(opts.output));
  });

program
  .command("validate <theme>")
  .description("Validate a theme's colors and contrast ratios")
  .action((themeName: string) => {
    const theme = getTheme(themeName);
    if (!theme) {
      console.error(`Unknown theme: "${themeName}".`);
      process.exit(1);
    }

    console.log(`Validating: ${theme.name} (${theme.mode})\n`);

    const issues = validateTheme(theme);
    if (issues.length === 0) {
      console.log("All checks passed.");
    } else {
      for (const issue of issues) {
        const prefix = issue.severity === "error" ? "ERROR" : "WARN ";
        console.log(`  [${prefix}] ${issue.message}`);
      }
    }

    // Extra contrast report
    console.log("\nContrast report:");
    const pairs: [string, string, string][] = [
      ["textPrimary / background", theme.colors.textPrimary, theme.colors.background],
      ["textSecondary / background", theme.colors.textSecondary, theme.colors.background],
      ["textPrimary / surface", theme.colors.textPrimary, theme.colors.surface],
      ["primary / background", theme.colors.primary, theme.colors.background],
      ["accent / background", theme.colors.accent, theme.colors.background],
    ];
    for (const [label, fg, bg] of pairs) {
      const result = wcagCheck(fg, bg);
      const status = result.aa ? "AA" : result.aaLarge ? "AA-large" : "FAIL";
      console.log(`  ${label}: ${result.ratio}:1 [${status}]`);
    }
  });

program
  .command("harmony <color>")
  .description("Generate color harmonies from a base color")
  .option("-t, --type <type>", "Harmony type: complementary, analogous, triadic, split-complementary", "complementary")
  .action((color: string, opts) => {
    const type = opts.type as HarmonyType;
    const colors = generateHarmony(color, type);
    console.log(`${type} harmony for ${color}:`);
    for (const c of colors) {
      console.log(`  ${c}`);
    }
  });

program.parse();
