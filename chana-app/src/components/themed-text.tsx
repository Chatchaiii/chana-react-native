import { Fonts, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Platform, StyleSheet, Text, type TextProps } from "react-native";

export type TextTypes = keyof typeof styles;

export type ThemedTextProps = TextProps & {
  type?: TextTypes;
  themeColor?: ThemeColor;
};

export function ThemedText({
  type = "text",
  themeColor = "fg1",
  style,
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[{ color: theme[themeColor] }, styles[type], style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 64,
    fontWeight: 800,
    lineHeight: 72,
  },
  heading_2: {
    fontSize: 48,
    fontWeight: 800,
    lineHeight: 56,
  },
  heading_3: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 30,
  },
  heading_4: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 22,
  },
  sublabel: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 21,
  },
  subtext: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 16,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
    lineHeight: 17,
  },
});
