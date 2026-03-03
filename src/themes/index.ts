import type { BaseTheme } from "../types.js";
import { monokaiDark } from "./monokai-dark.js";
import { monokaiLight } from "./monokai-light.js";
import { tangoDark } from "./tango-dark.js";
import { tangoLight } from "./tango-light.js";
import { highContrastDark } from "./high-contrast-dark.js";
import { highContrastLight } from "./high-contrast-light.js";

export const themeRegistry: Record<string, BaseTheme> = {
  "monokai-dark": monokaiDark,
  "monokai-light": monokaiLight,
  "tango-dark": tangoDark,
  "tango-light": tangoLight,
  "high-contrast-dark": highContrastDark,
  "high-contrast-light": highContrastLight,
};

export function getTheme(name: string): BaseTheme | undefined {
  return themeRegistry[name];
}

export function listThemes(): string[] {
  return Object.keys(themeRegistry);
}

export { monokaiDark, monokaiLight, tangoDark, tangoLight, highContrastDark, highContrastLight };
