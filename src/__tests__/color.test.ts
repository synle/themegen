import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  relativeLuminance,
  contrastRatio,
  wcagCheck,
  lighten,
  darken,
  adjustHue,
} from "../utils/color.js";

describe("hex/rgb conversion (happy path)", () => {
  it("hexToRgb decodes a 6-digit hex (with # prefix)", () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
    expect(hexToRgb("#00ff00")).toEqual([0, 255, 0]);
    expect(hexToRgb("#0000ff")).toEqual([0, 0, 255]);
  });

  it("hexToRgb tolerates a hex without # prefix", () => {
    expect(hexToRgb("ffffff")).toEqual([255, 255, 255]);
    expect(hexToRgb("000000")).toEqual([0, 0, 0]);
  });

  it("rgbToHex round-trips through hexToRgb", () => {
    const samples = ["#ff0000", "#43a047", "#1976d2", "#8e24aa", "#000000", "#ffffff"];
    for (const hex of samples) {
      const [r, g, b] = hexToRgb(hex);
      expect(rgbToHex(r, g, b)).toBe(hex);
    }
  });

  it("rgbToHex clamps out-of-range values to [0,255]", () => {
    expect(rgbToHex(-50, 0, 0)).toBe("#000000");
    expect(rgbToHex(300, 300, 300)).toBe("#ffffff");
  });

  it("rgbToHex rounds non-integer values", () => {
    expect(rgbToHex(255.4, 0.6, 127.5)).toBe("#ff0180");
  });
});

describe("hex/hsl round-trip", () => {
  it("primary colors survive hex → hsl → hex within 1 unit", () => {
    const samples = ["#ff0000", "#00ff00", "#0000ff", "#43a047", "#1976d2"];
    for (const hex of samples) {
      const [h, s, l] = hexToHsl(hex);
      const back = hslToHex(h, s, l);
      const [r1, g1, b1] = hexToRgb(hex);
      const [r2, g2, b2] = hexToRgb(back);
      expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(1);
      expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(1);
      expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(1);
    }
  });

  it("grayscale (s=0) maps regardless of hue", () => {
    const [h, s, l] = rgbToHsl(128, 128, 128);
    expect(s).toBe(0);
    expect(l).toBeCloseTo(128 / 255, 3);
    expect(hslToRgb(h, s, l)).toEqual([128, 128, 128]);
  });
});

describe("WCAG contrast", () => {
  it("relativeLuminance: black is 0, white is 1", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 5);
  });

  it("contrastRatio: black-on-white = 21 (max)", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("contrastRatio: identical colors = 1 (min)", () => {
    expect(contrastRatio("#7f7f7f", "#7f7f7f")).toBeCloseTo(1, 5);
  });

  it("contrastRatio is symmetric", () => {
    const a = contrastRatio("#1976d2", "#ffffff");
    const b = contrastRatio("#ffffff", "#1976d2");
    expect(a).toBeCloseTo(b, 5);
  });

  it("wcagCheck: black-on-white passes both AA and AAA", () => {
    const r = wcagCheck("#000000", "#ffffff");
    expect(r.aa).toBe(true);
    expect(r.aaa).toBe(true);
    expect(r.ratio).toBeGreaterThan(7);
  });

  it("wcagCheck: low-contrast pair fails AA", () => {
    const r = wcagCheck("#bbbbbb", "#cccccc");
    expect(r.aa).toBe(false);
    expect(r.aaa).toBe(false);
  });
});

describe("color manipulation edges", () => {
  it("lighten(white, x) stays at white (no overflow)", () => {
    expect(lighten("#ffffff", 0.3)).toBe("#ffffff");
  });

  it("darken(black, x) stays at black (no underflow)", () => {
    expect(darken("#000000", 0.3)).toBe("#000000");
  });

  it("lighten + darken (same amount) is approximately the original", () => {
    const original = "#1976d2";
    const round = darken(lighten(original, 0.1), 0.1);
    const [r1, g1, b1] = hexToRgb(original);
    const [r2, g2, b2] = hexToRgb(round);
    // HSL lightness clamping makes this lossy near the bounds; allow ±5 on each channel
    expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(5);
    expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(5);
    expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(5);
  });

  it("adjustHue(360°) returns the same color", () => {
    const original = "#1976d2";
    const [r1, g1, b1] = hexToRgb(original);
    const [r2, g2, b2] = hexToRgb(adjustHue(original, 360));
    expect(Math.abs(r1 - r2)).toBeLessThanOrEqual(1);
    expect(Math.abs(g1 - g2)).toBeLessThanOrEqual(1);
    expect(Math.abs(b1 - b2)).toBeLessThanOrEqual(1);
  });

  it("adjustHue handles negative degrees by normalizing", () => {
    const a = adjustHue("#1976d2", 90);
    const b = adjustHue("#1976d2", -270);
    expect(a).toBe(b);
  });
});
