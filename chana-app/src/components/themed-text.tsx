import { Fonts, ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Platform, StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = {
  type?: TextTypes;
  themeColor?: ThemeColor;
};

export type TextTypes =
  | "heading"
  | "heading_2"
  | "heading_3"
  | "heading_4"
  | "label"
  | "sublabel"
  | "text"
  | "subtext"
  | "code";

export function ThemedText({
  style,
  type = "text",
  themeColor,
  ...rest
}: ThemedTextProps & TextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? "fg1"] },
        type === "heading" && styles.heading,
        type === "heading_2" && styles.heading_2,
        type === "heading_3" && styles.heading_3,
        type === "heading_4" && styles.heading_4,
        type === "label" && styles.label,
        type === "sublabel" && styles.sublabel,
        type === "text" && styles.text,
        type === "subtext" && styles.subtext,
        type === "code" && styles.code,
        style,
      ]}
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
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 15,
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
    lineHeight: 17,
  },
});
