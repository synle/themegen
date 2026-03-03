import type { BaseTheme } from "../types.js";
import { contrastRatio, wcagCheck } from "./color.js";

export type ValidationIssue = {
  severity: "error" | "warning";
  message: string;
};

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function validateHex(value: string, path: string): ValidationIssue[] {
  if (!HEX_RE.test(value)) {
    return [{ severity: "error", message: `Invalid hex color "${value}" at ${path}` }];
  }
  return [];
}

export function validateTheme(theme: BaseTheme): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!theme.name) {
    issues.push({ severity: "error", message: "Theme name is required" });
  }
  if (theme.mode !== "dark" && theme.mode !== "light") {
    issues.push({ severity: "error", message: `Invalid mode "${theme.mode}"` });
  }

  const { colors } = theme;
  const semanticKeys = [
    "background", "surface", "primary", "secondary", "accent",
    "textPrimary", "textSecondary", "success", "warning", "error",
  ] as const;

  for (const key of semanticKeys) {
    issues.push(...validateHex(colors[key], `colors.${key}`));
  }

  const ansiKeys = Object.keys(colors.ansi) as (keyof typeof colors.ansi)[];
  for (const key of ansiKeys) {
    issues.push(...validateHex(colors.ansi[key], `colors.ansi.${key}`));
  }

  // WCAG contrast checks
  const textBgPairs: [string, string, string][] = [
    ["textPrimary", colors.textPrimary, colors.background],
    ["textSecondary", colors.textSecondary, colors.background],
    ["textPrimary on surface", colors.textPrimary, colors.surface],
  ];

  for (const [label, fg, bg] of textBgPairs) {
    if (!HEX_RE.test(fg) || !HEX_RE.test(bg)) continue;
    const result = wcagCheck(fg, bg);
    if (!result.aa) {
      issues.push({
        severity: "warning",
        message: `${label}: contrast ratio ${result.ratio}:1 fails WCAG AA (need 4.5:1)`,
      });
    }
  }

  return issues;
}
