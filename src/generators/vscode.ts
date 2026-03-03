import type { BaseTheme, GeneratorResult } from "../types.js";

/**
 * VSCode color theme JSON — goes into .vscode/extensions or
 * a theme extension's themes/ folder.
 */
export function generateVSCodeTheme(theme: BaseTheme): GeneratorResult {
  const { colors, name, mode } = theme;
  const { ansi } = colors;
  const type = mode === "dark" ? "dark" : "light";

  const vscodeTheme = {
    name,
    type,
    colors: {
      // Editor
      "editor.background": colors.background,
      "editor.foreground": colors.textPrimary,
      "editor.selectionBackground": colors.primary + "44",
      "editor.lineHighlightBackground": colors.surface,
      "editorCursor.foreground": colors.primary,
      "editorWhitespace.foreground": colors.textSecondary + "33",

      // Sidebar
      "sideBar.background": colors.surface,
      "sideBar.foreground": colors.textPrimary,
      "sideBarTitle.foreground": colors.textPrimary,

      // Activity bar
      "activityBar.background": colors.background,
      "activityBar.foreground": colors.primary,
      "activityBarBadge.background": colors.accent,
      "activityBarBadge.foreground": "#ffffff",

      // Title bar
      "titleBar.activeBackground": colors.background,
      "titleBar.activeForeground": colors.textPrimary,
      "titleBar.inactiveBackground": colors.surface,

      // Status bar
      "statusBar.background": colors.primary,
      "statusBar.foreground": mode === "dark" ? "#000000" : "#ffffff",
      "statusBar.debuggingBackground": colors.warning,

      // Tabs
      "tab.activeBackground": colors.background,
      "tab.activeForeground": colors.textPrimary,
      "tab.inactiveBackground": colors.surface,
      "tab.inactiveForeground": colors.textSecondary,
      "tab.activeBorderTop": colors.primary,

      // Terminal
      "terminal.ansiBlack": ansi.black,
      "terminal.ansiRed": ansi.red,
      "terminal.ansiGreen": ansi.green,
      "terminal.ansiYellow": ansi.yellow,
      "terminal.ansiBlue": ansi.blue,
      "terminal.ansiMagenta": ansi.magenta,
      "terminal.ansiCyan": ansi.cyan,
      "terminal.ansiWhite": ansi.white,
      "terminal.ansiBrightBlack": ansi.brightBlack,
      "terminal.ansiBrightRed": ansi.brightRed,
      "terminal.ansiBrightGreen": ansi.brightGreen,
      "terminal.ansiBrightYellow": ansi.brightYellow,
      "terminal.ansiBrightBlue": ansi.brightBlue,
      "terminal.ansiBrightMagenta": ansi.brightMagenta,
      "terminal.ansiBrightCyan": ansi.brightCyan,
      "terminal.ansiBrightWhite": ansi.brightWhite,
      "terminal.background": colors.background,
      "terminal.foreground": colors.textPrimary,

      // Input
      "input.background": colors.surface,
      "input.foreground": colors.textPrimary,
      "input.border": colors.textSecondary + "44",
      "input.placeholderForeground": colors.textSecondary,

      // Lists
      "list.activeSelectionBackground": colors.primary + "44",
      "list.activeSelectionForeground": colors.textPrimary,
      "list.hoverBackground": colors.surface,

      // Errors / warnings
      "editorError.foreground": colors.error,
      "editorWarning.foreground": colors.warning,
      "editorInfo.foreground": colors.secondary,
    },
    tokenColors: [
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: colors.textSecondary, fontStyle: "italic" },
      },
      {
        scope: ["string", "string.quoted"],
        settings: { foreground: colors.warning },
      },
      {
        scope: ["constant.numeric", "constant.language"],
        settings: { foreground: colors.accent },
      },
      {
        scope: ["keyword", "storage.type", "storage.modifier"],
        settings: { foreground: colors.accent },
      },
      {
        scope: ["entity.name.function", "support.function"],
        settings: { foreground: colors.primary },
      },
      {
        scope: ["entity.name.type", "entity.name.class", "support.class"],
        settings: { foreground: colors.secondary },
      },
      {
        scope: ["variable", "variable.other"],
        settings: { foreground: colors.textPrimary },
      },
      {
        scope: ["entity.name.tag"],
        settings: { foreground: colors.accent },
      },
      {
        scope: ["entity.other.attribute-name"],
        settings: { foreground: colors.primary },
      },
    ],
  };

  return {
    filename: "vscode.json",
    content: JSON.stringify(vscodeTheme, null, 2),
  };
}
