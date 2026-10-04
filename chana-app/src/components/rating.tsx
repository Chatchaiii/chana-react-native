import { ThemedIcon } from "@/components/themed-icon";
import type { ThemeColor } from "@/constants/theme";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export type RatingValue = 1 | 2 | 3 | 4 | 5;

export type RatingProps = {
  value: RatingValue;
  size?: number;
  /** Color of the reached stars; the rest use fg3 */
  color?: ThemeColor;
};

const MAX_RATING = 5;

/** Read-only row of five stars */
export function Rating({ value, size = 14, color = "acc1" }: RatingProps) {
  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Rated ${value} of ${MAX_RATING}`}
    >
      {Array.from({ length: MAX_RATING }, (_, i) => {
        const reached = i < value;
        return (
          <ThemedIcon
            key={i}
            icon={reached ? "star.fill" : "star"}
            size={size}
            themeColor={reached ? color : "fg3"}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.half,
  },
});
