import type { BaseTheme, GeneratorResult } from "../types.js";
import { hexToRgb } from "../utils/color.js";

/**
 * Sublime Text .tmTheme (XML plist format)
 */

function hexToTmColor(hex: string, alpha = "FF"): string {
  return hex.toUpperCase() + alpha;
}

function dictEntry(scope: string, fg: string, fontStyle?: string): string {
  let settings = `\t\t\t\t<key>foreground</key>\n\t\t\t\t<string>${hexToTmColor(fg)}</string>`;
  if (fontStyle) {
    settings += `\n\t\t\t\t<key>fontStyle</key>\n\t\t\t\t<string>${fontStyle}</string>`;
  }
  return `\t\t<dict>
\t\t\t<key>name</key>
\t\t\t<string>${scope}</string>
\t\t\t<key>scope</key>
\t\t\t<string>${scope.toLowerCase()}</string>
\t\t\t<key>settings</key>
\t\t\t<dict>
${settings}
\t\t\t</dict>
\t\t</dict>`;
}

export function generateSublimeTheme(theme: BaseTheme): GeneratorResult {
  const { colors, name } = theme;

  const scopes = [
    dictEntry("Comment", colors.textSecondary, "italic"),
    dictEntry("String", colors.warning),
    dictEntry("Number", colors.accent),
    dictEntry("Keyword", colors.accent),
    dictEntry("Function", colors.primary),
    dictEntry("Class", colors.secondary),
    dictEntry("Variable", colors.textPrimary),
    dictEntry("Tag", colors.accent),
    dictEntry("Attribute", colors.primary),
    dictEntry("constant", colors.accent),
    dictEntry("storage", colors.accent),
    dictEntry("support", colors.secondary),
    dictEntry("entity.name", colors.primary),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>name</key>
\t<string>${name}</string>
\t<key>settings</key>
\t<array>
\t\t<dict>
\t\t\t<key>settings</key>
\t\t\t<dict>
\t\t\t\t<key>background</key>
\t\t\t\t<string>${hexToTmColor(colors.background)}</string>
\t\t\t\t<key>foreground</key>
\t\t\t\t<string>${hexToTmColor(colors.textPrimary)}</string>
\t\t\t\t<key>caret</key>
\t\t\t\t<string>${hexToTmColor(colors.primary)}</string>
\t\t\t\t<key>selection</key>
\t\t\t\t<string>${hexToTmColor(colors.primary, "44")}</string>
\t\t\t\t<key>lineHighlight</key>
\t\t\t\t<string>${hexToTmColor(colors.surface, "80")}</string>
\t\t\t\t<key>gutter</key>
\t\t\t\t<string>${hexToTmColor(colors.surface)}</string>
\t\t\t\t<key>gutterForeground</key>
\t\t\t\t<string>${hexToTmColor(colors.textSecondary)}</string>
\t\t\t</dict>
\t\t</dict>
${scopes.join("\n")}
\t</array>
</dict>
</plist>
`;

  return {
    filename: "sublime.tmTheme",
    content: xml,
  };
}
