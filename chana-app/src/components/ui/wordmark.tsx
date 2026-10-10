import {
  TextStyles,
  ThemedText,
  type TextType,
} from "@/components/ui/themed-text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image, type ImageProps } from "expo-image";
import { StyleSheet, View, type ViewProps } from "react-native";

const TEXT_TYPE: TextType = "heading_2";
const LogoLight = require("@/assets/images/icon-foreground-light.png");
const LogoDark = require("@/assets/images/icon-foreground-dark.png");

/** The heart and "CHANA" side by side, e.g. at the top of the welcome screen */
export function Wordmark({ style, ...rest }: ViewProps) {
  return (
    <View
      {...rest}
      accessible
      accessibilityRole="header"
      accessibilityLabel="Chana"
      style={[styles.row, style]}
    >
      {/* Sized to the letters */}
      <ThemedText type={TEXT_TYPE}>CH</ThemedText>
      <Logo size={TextStyles[TEXT_TYPE].fontSize * 0.8} />
      <ThemedText type={TEXT_TYPE}>NA</ThemedText>
    </View>
  );
}

export type LogoProps = Omit<ImageProps, "source"> & {
  /** Width and height in points */
  size: number;
};

/** The Chana heart, in its light or dark version to match the color scheme */
export function Logo({ size, style, ...rest }: LogoProps) {
  const scheme = useColorScheme();

  return (
    <Image
      {...rest}
      source={scheme === "dark" ? LogoDark : LogoLight}
      contentFit="contain"
      accessibilityIgnoresInvertColors
      style={[{ width: size, height: size }, style]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
