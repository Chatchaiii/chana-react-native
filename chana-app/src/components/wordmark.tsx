import { Logo } from "@/components/logo";
import {
  TextStyles,
  ThemedText,
  type TextType,
} from "@/components/themed-text";
import { StyleSheet, View, type ViewProps } from "react-native";

const TEXT_TYPE: TextType = "heading_2";

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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
