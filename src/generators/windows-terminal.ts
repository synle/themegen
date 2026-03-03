import type { BaseTheme, GeneratorResult } from "../types.js";

/**
 * Windows Terminal color scheme JSON fragment.
 * Drop into the "schemes" array in settings.json.
 */
export function generateWindowsTerminalTheme(theme: BaseTheme): GeneratorResult {
  const { colors, name } = theme;
  const { ansi } = colors;

  const scheme = {
    name,
    background: colors.background,
    foreground: colors.textPrimary,
    cursorColor: colors.primary,
    selectionBackground: colors.primary + "44",
    black: ansi.black,
    red: ansi.red,
    green: ansi.green,
    yellow: ansi.yellow,
    blue: ansi.blue,
    purple: ansi.magenta,
    cyan: ansi.cyan,
    white: ansi.white,
    brightBlack: ansi.brightBlack,
    brightRed: ansi.brightRed,
    brightGreen: ansi.brightGreen,
    brightYellow: ansi.brightYellow,
    brightBlue: ansi.brightBlue,
    brightPurple: ansi.brightMagenta,
    brightCyan: ansi.brightCyan,
    brightWhite: ansi.brightWhite,
  };

  return {
    filename: "windows-terminal.json",
    content: JSON.stringify(scheme, null, 2),
  };
}
