import { Spacing } from "@/constants/theme";
import type { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type SheetContentProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Padded column for the content of a native sheet. Scrolls only when it
 * doesn't fit (e.g. a full-screen sheet in landscape). No bottom safe-area
 * padding: on iOS 26 the sheet already floats above the home indicator.
 */
export function SheetContent({ children, style }: SheetContentProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      alwaysBounceVertical={false}
      contentContainerStyle={[
        styles.container,
        // Clear of the notch in landscape
        {
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
        style,
      ]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.five,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
});
