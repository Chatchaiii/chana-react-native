import { ListItem } from "@/components/list-item";
import { ThemedText } from "@/components/themed-text";
import { Thumbnail } from "@/components/thumbnail";
import { Spacing } from "@/constants/theme";
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

  return (
    <ListItem
      leading={<Thumbnail src={place.image} />}
      overline={
        <PlaceMeta
          author={place.author}
          distance={place.distance}
          visited={place.visited}
        />
      }
      label={place.name}
      sublabel={place.description}
      footer={
        place.ratings.length > 0 ? (
          <ThemedText type="sublabel" themeColor="acc1">
            {formatRating(averageRating(place.ratings))} stars
          </ThemedText>
        ) : null
      }
      onPress={() =>
        router.push({ pathname: "/places/[id]", params: { id: place.id } })
      }
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
      <ThemedText type="subtext" themeColor={visited ? "pos1" : "neg1"}>
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
  author: {
    flexShrink: 1,
  },
});
