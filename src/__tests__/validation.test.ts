import { describe, it, expect } from "vitest";
import { validateTheme } from "../utils/validation.js";
import type { BaseTheme } from "../types.js";

function makeValidTheme(): BaseTheme {
  return {
    name: "test-theme",
    mode: "dark",
    colors: {
      background: "#1e1e1e",
      surface: "#252526",
      primary: "#1976d2",
      secondary: "#43a047",
      accent: "#ff8f00",
      textPrimary: "#ffffff",
      textSecondary: "#bbbbbb",
      success: "#43a047",
      warning: "#ff8f00",
      error: "#e53935",
      ansi: {
        black: "#000000",
        red: "#e53935",
        green: "#43a047",
        yellow: "#ff8f00",
        blue: "#1976d2",
        magenta: "#8e24aa",
        cyan: "#00acc1",
        white: "#bbbbbb",
        brightBlack: "#666666",
        brightRed: "#ef5350",
        brightGreen: "#66bb6a",
        brightYellow: "#ffa726",
        brightBlue: "#42a5f5",
        brightMagenta: "#ab47bc",
        brightCyan: "#26c6da",
        brightWhite: "#ffffff",
      },
    },
  };
}

describe("validateTheme — happy path", () => {
  it("a fully-valid dark theme produces no error issues", () => {
    const issues = validateTheme(makeValidTheme()).filter((i) => i.severity === "error");
    expect(issues).toEqual([]);
  });
});

describe("validateTheme — error cases", () => {
  it("missing name produces an error", () => {
    const t = makeValidTheme();
    t.name = "";
    const errs = validateTheme(t).filter((i) => i.severity === "error");
    expect(errs.some((e) => e.message.includes("name"))).toBe(true);
  });

  it("invalid mode produces an error", () => {
    const t = makeValidTheme();
    // @ts-expect-error — intentionally invalid
    t.mode = "neon";
    const errs = validateTheme(t).filter((i) => i.severity === "error");
    expect(errs.some((e) => e.message.toLowerCase().includes("mode"))).toBe(true);
  });

  it("malformed hex on a semantic color produces an error pointing at the path", () => {
    const t = makeValidTheme();
    t.colors.primary = "not-a-hex";
    const errs = validateTheme(t).filter((i) => i.severity === "error");
    expect(errs.some((e) => e.message.includes("colors.primary"))).toBe(true);
  });

  it("3-digit hex (shorthand) is rejected by the strict 6-digit validator", () => {
    const t = makeValidTheme();
    t.colors.background = "#fff";
    const errs = validateTheme(t).filter((i) => i.severity === "error");
    expect(errs.some((e) => e.message.includes("colors.background"))).toBe(true);
  });

  it("uppercase hex is accepted", () => {
    const t = makeValidTheme();
    t.colors.primary = "#ABCDEF";
    const errs = validateTheme(t).filter((i) => i.severity === "error");
    expect(errs).toEqual([]);
  });

  it("malformed ANSI hex produces an error pointing at colors.ansi.<key>", () => {
    const t = makeValidTheme();
    t.colors.ansi.red = "ff0000"; // missing #
    const errs = validateTheme(t).filter((i) => i.severity === "error");
    expect(errs.some((e) => e.message.includes("colors.ansi.red"))).toBe(true);
  });
});

describe("validateTheme — WCAG warnings", () => {
  it("low-contrast text on background produces at least one warning", () => {
    const t = makeValidTheme();
    t.colors.textPrimary = "#222222";  // very low contrast on dark bg
    const issues = validateTheme(t);
    expect(issues.some((i) => i.severity === "warning")).toBe(true);
  });
});
