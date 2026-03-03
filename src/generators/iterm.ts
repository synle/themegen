import type { BaseTheme, GeneratorResult } from "../types.js";
import { hexToRgb } from "../utils/color.js";

/**
 * iTerm2 .itermcolors (XML plist format)
 */

function colorEntry(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `\t<dict>
\t\t<key>Alpha Component</key>
\t\t<real>1</real>
\t\t<key>Blue Component</key>
\t\t<real>${(b / 255).toFixed(6)}</real>
\t\t<key>Color Space</key>
\t\t<string>sRGB</string>
\t\t<key>Green Component</key>
\t\t<real>${(g / 255).toFixed(6)}</real>
\t\t<key>Red Component</key>
\t\t<real>${(r / 255).toFixed(6)}</real>
\t</dict>`;
}

export function generateITermTheme(theme: BaseTheme): GeneratorResult {
  const { colors } = theme;
  const { ansi } = colors;

  // iTerm2 maps Ansi 0-7 = normal, Ansi 8-15 = bright
  const ansiOrder = [
    ansi.black, ansi.red, ansi.green, ansi.yellow,
    ansi.blue, ansi.magenta, ansi.cyan, ansi.white,
    ansi.brightBlack, ansi.brightRed, ansi.brightGreen, ansi.brightYellow,
    ansi.brightBlue, ansi.brightMagenta, ansi.brightCyan, ansi.brightWhite,
  ];

  const entries: string[] = [];

  for (let i = 0; i < 16; i++) {
    entries.push(`\t<key>Ansi ${i} Color</key>\n${colorEntry(ansiOrder[i])}`);
  }

  entries.push(`\t<key>Background Color</key>\n${colorEntry(colors.background)}`);
  entries.push(`\t<key>Foreground Color</key>\n${colorEntry(colors.textPrimary)}`);
  entries.push(`\t<key>Bold Color</key>\n${colorEntry(colors.textPrimary)}`);
  entries.push(`\t<key>Cursor Color</key>\n${colorEntry(colors.primary)}`);
  entries.push(`\t<key>Cursor Text Color</key>\n${colorEntry(colors.background)}`);
  entries.push(`\t<key>Selection Color</key>\n${colorEntry(colors.primary)}`);
  entries.push(`\t<key>Selected Text Color</key>\n${colorEntry(colors.textPrimary)}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${entries.join("\n")}
</dict>
</plist>
`;

  return {
    filename: "iterm.itermcolors",
    content: xml,
  };
}
