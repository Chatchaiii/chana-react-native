import { ListItem } from "@/components/ui/list-item";
import { MAX_RATING } from "@/components/ui/rating";
import { Icon } from "@/components/ui/icon";
import { ThemedText } from "@/components/ui/themed-text";
import { Thumbnail } from "@/components/ui/thumbnail";
import { Spacing } from "@/constants/theme";
import { usePlaceVisit } from "@/data/place-visits";
import { useDetailRoutes } from "@/hooks/use-detail-routes";
import type { Place } from "@/types/place";
import { averageRating, formatRating } from "@/utils/ratings";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export type PlaceItemProps = {
  place: Place;
};

/** A place in a list: photo, author and distance, name, description, rating */
export function PlaceItem({ place }: PlaceItemProps) {
  const router = useRouter();
  const routes = useDetailRoutes();
  const { visited } = usePlaceVisit(place);
  const average = formatRating(averageRating(place.ratings));

  return (
    <ListItem
      leading={<Thumbnail src={place.image} />}
      overline={
        <PlaceMeta
          author={place.author}
          distance={place.distance}
          visited={visited}
        />
      }
      label={place.name}
      sublabel={place.description}
      footer={
        place.ratings.length > 0 ? (
          <View
            style={styles.rating}
            accessible
            accessibilityLabel={`Rated ${average} of ${MAX_RATING}`}
          >
            <Icon icon="star.fill" themeColor="acc1" size={12} />
            <ThemedText type="sublabel" themeColor="acc1">
              {average}
            </ThemedText>
          </View>
        ) : null
      }
      onPress={() => router.push(routes.place(place.id))}
    />
  );
}

type PlaceMetaProps = Pick<Place, "author" | "distance" | "visited">;

/** Author, distance and visited state, shown above a place's name */
export function PlaceMeta({ author, distance, visited }: PlaceMetaProps) {
  return (
    <View style={styles.meta}>
      <ThemedText type="sublabel" numberOfLines={1} style={styles.author}>
        {author}
      </ThemedText>
      <ThemedText type="subtext" themeColor="fg2">
        {distance}
      </ThemedText>
      <ThemedText type="subtext" themeColor={visited ? "acc1" : "fg2"}>
        {visited ? "Visited" : "Not visited"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  author: {
    flexShrink: 1,
  },
});
