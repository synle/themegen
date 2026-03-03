import type { BaseTheme, GeneratorResult } from "../types.js";
import { hexToRgb } from "../utils/color.js";

/**
 * JetBrains IDE .icls color scheme (XML format)
 * Import via: Settings > Editor > Color Scheme > Import Scheme
 */

function hexToJbRgb(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return ((r << 16) | (g << 8) | b).toString();
}

function option(name: string, value: string): string {
  return `      <option name="${name}" value="${value}" />`;
}

function attr(name: string, fg?: string, bg?: string, fontStyle?: number): string {
  const opts: string[] = [];
  if (fg) opts.push(option("FOREGROUND", hexToJbRgb(fg)));
  if (bg) opts.push(option("BACKGROUND", hexToJbRgb(bg)));
  if (fontStyle !== undefined) opts.push(option("FONT_TYPE", fontStyle.toString()));
  return `    <option name="${name}">
      <value>
${opts.join("\n")}
      </value>
    </option>`;
}

export function generateJetBrainsTheme(theme: BaseTheme): GeneratorResult {
  const { colors, name, mode } = theme;
  const { ansi } = colors;

  const attributes = [
    attr("TEXT", colors.textPrimary, colors.background),
    attr("DEFAULT_COMMENT", colors.textSecondary, undefined, 2),
    attr("DEFAULT_STRING", colors.warning),
    attr("DEFAULT_NUMBER", colors.accent),
    attr("DEFAULT_KEYWORD", colors.accent, undefined, 1),
    attr("DEFAULT_FUNCTION_DECLARATION", colors.primary),
    attr("DEFAULT_CLASS_NAME", colors.secondary),
    attr("DEFAULT_INSTANCE_FIELD", colors.textPrimary),
    attr("DEFAULT_CONSTANT", colors.accent, undefined, 1),
    attr("DEFAULT_TAG", colors.accent),
    attr("DEFAULT_ATTRIBUTE", colors.primary),
    attr("DEFAULT_ENTITY", colors.secondary),
    attr("IDENTIFIER_UNDER_CARET_ATTRIBUTES", undefined, colors.surface),
    attr("TODO_DEFAULT_ATTRIBUTES", undefined, colors.warning + "33"),
  ];

  const consoleColors = [
    `    <option name="CONSOLE_BACKGROUND_KEY" value="${hexToJbRgb(colors.background)}" />`,
    `    <option name="CONSOLE_BLACK" value="${hexToJbRgb(ansi.black)}" />`,
    `    <option name="CONSOLE_RED" value="${hexToJbRgb(ansi.red)}" />`,
    `    <option name="CONSOLE_GREEN" value="${hexToJbRgb(ansi.green)}" />`,
    `    <option name="CONSOLE_YELLOW" value="${hexToJbRgb(ansi.yellow)}" />`,
    `    <option name="CONSOLE_BLUE" value="${hexToJbRgb(ansi.blue)}" />`,
    `    <option name="CONSOLE_MAGENTA" value="${hexToJbRgb(ansi.magenta)}" />`,
    `    <option name="CONSOLE_CYAN" value="${hexToJbRgb(ansi.cyan)}" />`,
    `    <option name="CONSOLE_WHITE" value="${hexToJbRgb(ansi.white)}" />`,
    `    <option name="CONSOLE_DARKGRAY" value="${hexToJbRgb(ansi.brightBlack)}" />`,
    `    <option name="CONSOLE_BRIGHT_RED" value="${hexToJbRgb(ansi.brightRed)}" />`,
    `    <option name="CONSOLE_BRIGHT_GREEN" value="${hexToJbRgb(ansi.brightGreen)}" />`,
    `    <option name="CONSOLE_BRIGHT_YELLOW" value="${hexToJbRgb(ansi.brightYellow)}" />`,
    `    <option name="CONSOLE_BRIGHT_BLUE" value="${hexToJbRgb(ansi.brightBlue)}" />`,
    `    <option name="CONSOLE_BRIGHT_MAGENTA" value="${hexToJbRgb(ansi.brightMagenta)}" />`,
    `    <option name="CONSOLE_BRIGHT_CYAN" value="${hexToJbRgb(ansi.brightCyan)}" />`,
    `    <option name="CONSOLE_GRAY" value="${hexToJbRgb(ansi.brightWhite)}" />`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<scheme name="${name}" version="142" parent_scheme="${mode === "dark" ? "Darcula" : "Default"}">
  <colors>
    <option name="CARET_COLOR" value="${hexToJbRgb(colors.primary)}" />
    <option name="CARET_ROW_COLOR" value="${hexToJbRgb(colors.surface)}" />
    <option name="GUTTER_BACKGROUND" value="${hexToJbRgb(colors.surface)}" />
    <option name="SELECTION_BACKGROUND" value="${hexToJbRgb(colors.primary)}44" />
    <option name="SELECTION_FOREGROUND" value="${hexToJbRgb(colors.textPrimary)}" />
${consoleColors.join("\n")}
  </colors>
  <attributes>
${attributes.join("\n")}
  </attributes>
</scheme>
`;

  return {
    filename: "jetbrains.icls",
    content: xml,
  };
}
