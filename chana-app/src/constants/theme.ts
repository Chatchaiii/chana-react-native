/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

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
    bg1: "#000000",
    bg2: "#5F5F5F",
    bg3: "#BBBBBB",

    fg1: "#ffffff",
    fg2: "#F4F4F4",
    fg3: "#E8E8E8",

    acc1: "#C66AF1",
    neg1: "#FF0000",
    neg2: "#FF000025",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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

export const IconContainerSizes = {
  xxs: 24,
  xs: 32,
  s: 36,
  m: 40,
  l: 80,
  xl: 120,
} as const;
export type IconContainerSize = keyof typeof IconContainerSizes;

export const IconBorderRadii = {
  round: 100,
  square_1: 16,
  square_2: 24,
  square_3: 32,
} as const;
export type IconBorderRadius = keyof typeof IconBorderRadii;

export const ButtonBorderRadii = {
  default: 16,
  rounded: 24,
  pill: 999,
} as const;
export type ButtonShape = keyof typeof ButtonBorderRadii;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
