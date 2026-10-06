import { List } from "@/components/list";
import { MAX_RATING, Rating } from "@/components/rating";
import { RingChart } from "@/components/ring-chart";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import type { RatingValue, UserRating } from "@/types/rating";
import { averageRating, formatRating } from "@/utils/ratings";
import { StyleSheet, View } from "react-native";

export type RatingSummaryProps = {
  ratings: UserRating[];
  /** The signed-in user; their row is tappable when `onRate` is set */
  currentUser?: string;
  onRate?: (value: RatingValue) => void;
};

/**
 * Card with the average rating as a ring, then each person's stars. The
 * current user can tap their stars to rate (empty stars until they have).
 */
export function RatingSummary({
  ratings,
  currentUser,
  onRate,
}: RatingSummaryProps) {
  const average = averageRating(ratings);
  const canRate = !!currentUser && !!onRate;
  // Show the current user's row even before they've rated
  const rows: { author: string; value: RatingValue | 0 }[] =
    canRate && !ratings.some((rating) => rating.author === currentUser)
      ? [...ratings, { author: currentUser, value: 0 }]
      : ratings;

  return (
    <List type="card">
      <View style={styles.row}>
        <RingChart portion={average} total={MAX_RATING} />
        <View>
          <ThemedText type="heading_4" themeColor="fg2">
            Rating
          </ThemedText>
          <ThemedText type="heading_3" themeColor="acc1">
            {ratings.length > 0 ? formatRating(average) : "–"}
          </ThemedText>
        </View>
      </View>

      {rows.map((rating) => {
        const editable = canRate && rating.author === currentUser;

        return (
          <View key={rating.author} style={[styles.row, styles.spread]}>
            <ThemedText type="heading_4" themeColor="fg2">
              {rating.author}
            </ThemedText>
            <Rating
              value={rating.value}
              size={editable ? 24 : 18}
              onChange={editable ? onRate : undefined}
            />
          </View>
        );
      })}
    </List>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
  },
  spread: {
    justifyContent: "space-between",
  },
});
