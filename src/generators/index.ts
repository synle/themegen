import type { BaseTheme, Generator, GeneratorResult } from "../types.js";
import { generateSlackTheme } from "./slack.js";
import { generateDiscordTheme } from "./discord.js";
import { generateWindowsTerminalTheme } from "./windows-terminal.js";
import { generateVSCodeTheme } from "./vscode.js";
import { generateITermTheme } from "./iterm.js";
import { generateSublimeTheme } from "./sublime.js";
import { generateJetBrainsTheme } from "./jetbrains.js";

export const generatorRegistry: Record<string, Generator> = {
  slack: generateSlackTheme,
  discord: generateDiscordTheme,
  "windows-terminal": generateWindowsTerminalTheme,
  vscode: generateVSCodeTheme,
  iterm: generateITermTheme,
  sublime: generateSublimeTheme,
  jetbrains: generateJetBrainsTheme,
};

export function runAllGenerators(theme: BaseTheme): GeneratorResult[] {
  return Object.values(generatorRegistry).map((gen) => gen(theme));
}

export function listGenerators(): string[] {
  return Object.keys(generatorRegistry);
}

export {
  generateSlackTheme,
  generateDiscordTheme,
  generateWindowsTerminalTheme,
  generateVSCodeTheme,
  generateITermTheme,
  generateSublimeTheme,
  generateJetBrainsTheme,
};
