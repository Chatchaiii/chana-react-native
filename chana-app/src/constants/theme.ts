import "@/global.css";

import { Platform } from "react-native";

/**
 * Light and dark palettes. bg = surfaces: bg1 = raised (cards, menu), bg2 =
 * page, bg3 = fills (controls, tracks, separators); in both modes bg1 sits
 * above bg2. menu / menuButton = the side menu, which goes darker than the
 * page in dark mode. fg = text and icons (1 = strongest, 3 = faint), acc = accent,
 * neg = destructive.
 */
export const Colors = {
  light: {
    bg1: "#ffffff",
    bg2: "#F4F4F4",
    bg3: "#E8E8E8",

    menu: "#fafafa",
    menuButton: "#efefef",

    fg1: "#000000",
    fg2: "#5F5F5F",
    fg3: "#BBBBBB",

    acc1: "#C66AF1",

    neg1: "#FF0000",
    neg2: "#FF000025",

    pos1: "#00ff00",
    pos2: "#00ff0025",

    constWhite: "#ffffff",
    constBlack: "#000000",
  },
  dark: {
    bg1: "#1e1e1e",
    bg2: "#111111",
    bg3: "#2c2c2c",

    menu: "#0a0a0a",
    menuButton: "#1a1a1a",

    fg1: "#ffffff",
    fg2: "#bdbdbd",
    fg3: "#6b6b6b",

    acc1: "#C66AF1",

    neg1: "#FF0000",
    neg2: "#FF000025",

    pos1: "#00ff00",
    pos2: "#00ff0025",

    constWhite: "#ffffff",
    constBlack: "#000000",
  },
} as const;
export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Fixed colors for UI drawn on top of photos, where theme colors can't be read */
export const OverlayColors = {
  foreground: "#ffffff",
  scrim: "rgba(0, 0, 0, 0.5)",
  backdrop: "#000000",
  control: "rgba(255, 255, 255, 0.15)",
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;
export type SpacingKey = keyof typeof Spacing;

/** Corner radii shared by every rounded element */
export const Radius = {
  sm: 20,
  md: 24,
  lg: 32,
  full: 999,
} as const;
export type RadiusKey = keyof typeof Radius;

/** Square sizes for avatars and icon containers */
export const ContainerSizes = {
  xxs: 24,
  xs: 32,
  s: 36,
  m: 40,
  l: 80,
  xl: 100,
  xxl: 120,
} as const;
export type ContainerSize = keyof typeof ContainerSizes;
