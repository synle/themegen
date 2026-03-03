import type { BaseTheme } from "../types.js";
import { hslToHex, deriveAnsiPalette, randomHue, lighten, darken } from "./color.js";

export function generateRandomTheme(): BaseTheme {
  const hue = randomHue();
  const isDark = Math.random() > 0.5;
  const mode = isDark ? "dark" : "light";

  const primary = hslToHex(hue, 0.7, isDark ? 0.6 : 0.45);
  const background = isDark ? hslToHex(hue, 0.1, 0.1) : hslToHex(hue, 0.05, 0.95);
  const surface = isDark ? lighten(background, 0.05) : darken(background, 0.03);

  const secondary = hslToHex((hue + 0.33) % 1, 0.5, isDark ? 0.55 : 0.4);
  const accent = hslToHex((hue + 0.55) % 1, 0.65, isDark ? 0.6 : 0.45);

  const textPrimary = isDark ? "#f0f0f0" : "#1a1a1a";
  const textSecondary = isDark ? "#a0a0a0" : "#555555";

  const id = Math.random().toString(36).slice(2, 8);

  return {
    name: `random-${id}`,
    mode,
    colors: {
      background,
      surface,
      primary,
      secondary,
      accent,
      textPrimary,
      textSecondary,
      success: "#4caf50",
      warning: "#ff9800",
      error: "#f44336",
      ansi: deriveAnsiPalette(primary, background, mode),
    },
  };
}
