import type { BaseTheme, GeneratorResult } from "../types.js";

/**
 * Slack sidebar theme — a comma-separated list of 9 hex colors:
 * Column BG, Menu BG Hover, Active Item, Active Item Text,
 * Hover Item, Text Color, Active Presence, Mention Badge, Top Nav BG/Text
 */
export function generateSlackTheme(theme: BaseTheme): GeneratorResult {
  const { colors } = theme;
  const slackTheme = {
    columnBg: colors.background,
    menuBgHover: colors.surface,
    activeItem: colors.primary,
    activeItemText: colors.textPrimary,
    hoverItem: colors.surface,
    textColor: colors.textSecondary,
    activePresence: colors.success,
    mentionBadge: colors.accent,
    topNavBg: colors.background,
    topNavText: colors.textPrimary,
    // Legacy comma-separated format
    legacy: [
      colors.background,
      colors.surface,
      colors.primary,
      colors.textPrimary,
      colors.surface,
      colors.textSecondary,
      colors.success,
      colors.accent,
      colors.background,
      colors.textPrimary,
    ].join(","),
  };

  return {
    filename: "slack.json",
    content: JSON.stringify(slackTheme, null, 2),
  };
}
