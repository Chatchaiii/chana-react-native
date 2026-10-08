import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

export const CHECK_CIRCLE_SIZE = 18;
// The inner dot's border shows the background, leaving a ring around the dot
const DOT_SIZE = 14;

export type CheckCircleProps = {
  checked: boolean;
  /** Color behind the circle, so the ring around the dot matches it */
  background: ThemeColor;
};

/** Radio-style check mark: an outlined circle, filled with the accent when checked */
export function CheckCircle({ checked, background }: CheckCircleProps) {
  const theme = useTheme();

  return (
    <ThemedView themeColor={checked ? "acc1" : "fg2"} style={styles.circle}>
      <ThemedView
        themeColor={checked ? "acc1" : background}
        style={[styles.dot, { borderColor: theme[background] }]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  circle: {
    height: CHECK_CIRCLE_SIZE,
    width: CHECK_CIRCLE_SIZE,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: DOT_SIZE,
    width: DOT_SIZE,
    borderRadius: Radius.full,
    borderWidth: Spacing.half,
  },
});
