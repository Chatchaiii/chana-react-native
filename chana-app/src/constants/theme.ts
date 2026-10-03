import "@/global.css";

import { Platform } from "react-native";

/**
 * Light and dark palettes. bg = surfaces (1 = top), fg = text and icons
 * (1 = strongest), acc = accent, neg = destructive.
 */
export const Colors = {
  light: {
    bg1: "#ffffff",
    bg2: "#F4F4F4",
    bg3: "#E8E8E8",

    fg1: "#000000",
    fg2: "#5F5F5F",
    fg3: "#BBBBBB",

    acc1: "#C66AF1",
    neg1: "#FF0000",
    neg2: "#FF000025",
  },
  dark: {
    bg1: "#111111",
    bg2: "#1e1e1e",
    bg3: "#2c2c2c",

    fg1: "#ffffff",
    fg2: "#bdbdbd",
    fg3: "#a1a1a1",

    acc1: "#C66AF1",
    neg1: "#FF0000",
    neg2: "#FF000025",
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
  sm: 16,
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
  xl: 120,
} as const;
export type ContainerSize = keyof typeof ContainerSizes;
