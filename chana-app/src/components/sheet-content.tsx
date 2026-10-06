import { Spacing } from "@/constants/theme";
import { StyleSheet, View, type ViewProps } from "react-native";

/**
 * Padded column for the content of a native sheet. No bottom safe-area
 * padding: on iOS 26 the sheet already floats above the home indicator.
 */
export function SheetContent({ style, ...rest }: ViewProps) {
  return <View {...rest} style={[styles.container, style]} />;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.five,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
});
