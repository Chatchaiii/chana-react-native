import { ListItem } from "@/components/list-item";
import { Rating, type RatingValue } from "@/components/rating";
import { ThemedText } from "@/components/themed-text";
import { Thumbnail } from "@/components/thumbnail";
import { Spacing } from "@/constants/theme";
import type { ImageSource } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export type Place = {
  id: string;
  name: string;
  description: string;
  /** Who added the place */
  author: string;
  /** Already formatted, e.g. "4 km" */
  distance: string;
  rating: RatingValue;
  image?: string | ImageSource;
};

export type PlaceItemProps = {
  place: Place;
};

/** A place in a list: photo, author and distance, name, description, rating */
export function PlaceItem({ place }: PlaceItemProps) {
  const router = useRouter();

  return (
    <ListItem
      leading={<Thumbnail src={place.image} />}
      overline={<PlaceMeta author={place.author} distance={place.distance} />}
      label={place.name}
      sublabel={place.description}
      footer={<Rating value={place.rating} />}
      onPress={() =>
        router.push({ pathname: "/places/[id]", params: { id: place.id } })
      }
    />
  );
}

type PlaceMetaProps = Pick<Place, "author" | "distance">;

/** "author · distance" line above a place's name */
export function PlaceMeta({ author, distance }: PlaceMetaProps) {
  return (
    <View style={styles.meta}>
      <ThemedText type="sublabel" numberOfLines={1} style={styles.author}>
        {author}
      </ThemedText>
      <ThemedText type="subtext" themeColor="fg2">
        · {distance}
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
