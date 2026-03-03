export type AnsiColors = {
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
};

export type BaseTheme = {
  name: string;
  mode: "dark" | "light";
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
    ansi: AnsiColors;
  };
};

export type ThemeOverrides = {
  primary?: string;
  background?: string;
  mode?: "dark" | "light";
};

export type GeneratorResult = {
  filename: string;
  content: string;
};

export type Generator = (theme: BaseTheme) => GeneratorResult;

export type WcagResult = {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
};

export type HarmonyType = "complementary" | "analogous" | "triadic" | "split-complementary";
