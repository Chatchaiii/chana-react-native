import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import type { ThemeColor } from "@/constants/theme";
import { Spacing } from "@/constants/theme";
import type { RatingValue } from "@/types/rating";
import { StyleSheet, View } from "react-native";

export type RatingProps = {
  /** 0 = not rated yet (all stars empty) */
  value: RatingValue | 0;
  size?: number;
  /** Color of the reached stars; the rest use fg3 */
  color?: ThemeColor;
  /** Makes the stars tappable: tapping a star sets the rating to it */
  onChange?: (value: RatingValue) => void;
};

export const MAX_RATING = 5;
const STAR_VALUES = Array.from(
  { length: MAX_RATING },
  (_, i) => (i + 1) as RatingValue,
);

const HIT_SLOP = {
  top: Spacing.two,
  bottom: Spacing.two,
  left: Spacing.one,
  right: Spacing.one,
};

/** Row of five stars; read-only unless `onChange` is set */
export function Rating({
  value,
  size = 14,
  color = "acc1",
  onChange,
}: RatingProps) {
  const star = (starValue: RatingValue) => {
    const reached = starValue <= value;
    return (
      <ThemedIcon
        icon={reached ? "star.fill" : "star"}
        size={size}
        themeColor={reached ? color : "fg3"}
      />
    );
  };

  if (!onChange) {
    return (
      <View
        style={styles.row}
        accessible
        accessibilityRole="image"
        accessibilityLabel={
          value > 0 ? `Rated ${value} of ${MAX_RATING}` : "Not rated"
        }
      >
        {STAR_VALUES.map((starValue) => (
          <View key={starValue}>{star(starValue)}</View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {STAR_VALUES.map((starValue) => (
        <ThemedPressable
          key={starValue}
          onPress={() => onChange(starValue)}
          // Stars are small; the gap between them still counts as a tap
          hitSlop={HIT_SLOP}
          accessibilityLabel={`${starValue} of ${MAX_RATING} stars`}
          accessibilityState={{ selected: starValue === value }}
        >
          {star(starValue)}
        </ThemedPressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.half,
  },
});
