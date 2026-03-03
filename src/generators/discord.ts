import type { BaseTheme, GeneratorResult } from "../types.js";

/**
 * Discord custom CSS variables for BetterDiscord / Vencord themes.
 */
export function generateDiscordTheme(theme: BaseTheme): GeneratorResult {
  const { colors, name, mode } = theme;
  const css = `/**
 * @name ${name}
 * @description Auto-generated ${mode} theme from themegen
 * @version 1.0.0
 */

:root {
  --background-primary: ${colors.background};
  --background-secondary: ${colors.surface};
  --background-secondary-alt: ${colors.surface};
  --background-tertiary: ${mode === "dark" ? "#1a1a1a" : "#e0e0e0"};
  --background-accent: ${colors.primary};
  --background-floating: ${colors.surface};
  --background-modifier-hover: ${colors.surface}33;
  --background-modifier-active: ${colors.surface}66;
  --background-modifier-selected: ${colors.primary}33;
  --text-normal: ${colors.textPrimary};
  --text-muted: ${colors.textSecondary};
  --text-link: ${colors.secondary};
  --interactive-normal: ${colors.textSecondary};
  --interactive-hover: ${colors.textPrimary};
  --interactive-active: ${colors.primary};
  --header-primary: ${colors.textPrimary};
  --header-secondary: ${colors.textSecondary};
  --brand-experiment: ${colors.primary};
  --brand-experiment-560: ${colors.primary};
  --status-positive: ${colors.success};
  --status-warning: ${colors.warning};
  --status-danger: ${colors.error};
  --channels-default: ${colors.textSecondary};
  --deprecated-card-bg: ${colors.surface}44;
}
`;

  return {
    filename: "discord.css",
    content: css,
  };
}
