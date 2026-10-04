import { ImageCarousel } from "@/components/image-carousel";
import { PlaceMeta } from "@/components/place-item";
import { Rating } from "@/components/rating";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { PLACEHOLDER_PLACES } from "@/constants/placeholder-places";
import { Spacing } from "@/constants/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

/** A single place, opened by tapping it in the Places list */
export default function PlaceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: load the place from real data
  const place = PLACEHOLDER_PLACES.find((item) => item.id === id);

  return (
    <>
      <Stack.Screen
        options={{ title: place?.name ?? "Place", headerTransparent: true }}
      />
      <ScreenScrollView contentContainerStyle={styles.content}>
        {place ? (
          <>
            {place.image && (
              <ImageCarousel images={[place.image]} aspectRatio={5 / 4} />
            )}
            <View style={styles.info}>
              <PlaceMeta author={place.author} distance={place.distance} />
              <ThemedText type="heading_3">{place.name}</ThemedText>
              <Rating value={place.rating} size={18} />
            </View>
            <ThemedText themeColor="fg2">{place.description}</ThemedText>
          </>
        ) : (
          <ThemedText themeColor="fg2" style={styles.notFound}>
            This place doesn’t exist anymore.
          </ThemedText>
        )}
      </ScreenScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  info: {
    gap: Spacing.one,
  },
  notFound: {
    textAlign: "center",
  },
});
