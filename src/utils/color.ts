import type { WcagResult, HarmonyType, AnsiColors } from "../types.js";

// --- Conversion helpers ---

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

export function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

export function hexToHsl(hex: string): [number, number, number] {
  return rgbToHsl(...hexToRgb(hex));
}

export function hslToHex(h: number, s: number, l: number): string {
  return rgbToHex(...hslToRgb(h, s, l));
}

// --- Luminance & WCAG ---

function srgbChannel(c: number): number {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b)
  );
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagCheck(fg: string, bg: string): WcagResult {
  const ratio = contrastRatio(fg, bg);
  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

// --- Color manipulation ---

export function lighten(hex: string, amount: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.min(1, l + amount));
}

export function darken(hex: string, amount: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, l - amount));
}

export function adjustHue(hex: string, degrees: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(((h + degrees / 360) % 1 + 1) % 1, s, l);
}

export function desaturate(hex: string, amount: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, Math.max(0, s - amount), l);
}

// --- Color harmony ---

export function generateHarmony(hex: string, type: HarmonyType): string[] {
  const [h, s, l] = hexToHsl(hex);
  switch (type) {
    case "complementary":
      return [hex, hslToHex((h + 0.5) % 1, s, l)];
    case "analogous":
      return [
        hslToHex((h - 1 / 12 + 1) % 1, s, l),
        hex,
        hslToHex((h + 1 / 12) % 1, s, l),
      ];
    case "triadic":
      return [
        hex,
        hslToHex((h + 1 / 3) % 1, s, l),
        hslToHex((h + 2 / 3) % 1, s, l),
      ];
    case "split-complementary":
      return [
        hex,
        hslToHex((h + 5 / 12) % 1, s, l),
        hslToHex((h + 7 / 12) % 1, s, l),
      ];
  }
}

// --- ANSI derivation ---

export function deriveAnsiPalette(
  primary: string,
  bg: string,
  mode: "dark" | "light"
): AnsiColors {
  const [h] = hexToHsl(primary);
  const isDark = mode === "dark";

  const base = (hue: number, sat: number, lit: number) =>
    hslToHex(((hue % 360) + 360) % 360 / 360, sat, lit);

  const hDeg = h * 360;

  return {
    black: isDark ? "#272822" : "#2e2e2e",
    red: base(0, 0.7, isDark ? 0.55 : 0.45),
    green: base(120, 0.6, isDark ? 0.55 : 0.4),
    yellow: base(50, 0.8, isDark ? 0.6 : 0.45),
    blue: base(210, 0.6, isDark ? 0.55 : 0.45),
    magenta: base(300, 0.55, isDark ? 0.55 : 0.45),
    cyan: base(180, 0.6, isDark ? 0.55 : 0.4),
    white: isDark ? "#f8f8f2" : "#d3d0c8",
    brightBlack: isDark ? "#75715e" : "#555555",
    brightRed: base(0, 0.8, isDark ? 0.65 : 0.55),
    brightGreen: base(120, 0.7, isDark ? 0.65 : 0.5),
    brightYellow: base(50, 0.9, isDark ? 0.7 : 0.55),
    brightBlue: base(210, 0.7, isDark ? 0.65 : 0.55),
    brightMagenta: base(300, 0.65, isDark ? 0.65 : 0.55),
    brightCyan: base(180, 0.7, isDark ? 0.65 : 0.5),
    brightWhite: isDark ? "#ffffff" : "#f5f5f5",
  };
}

// --- Random color ---

export function randomHex(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return rgbToHex(r, g, b);
}

export function randomHue(): number {
  return Math.random();
}
