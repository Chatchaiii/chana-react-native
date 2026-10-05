import { ImageCarousel } from "@/components/image-carousel";
import { PlaceMeta } from "@/components/place-item";
import { Rating } from "@/components/rating";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { ThemedButton, type ButtonType } from "@/components/themed-button";
import { ThemedCheckItem } from "@/components/themed-check-item";
import { ThemedText } from "@/components/themed-text";
import type { IconName } from "@/constants/icons.generated";
import { PLACEHOLDER_PLACES } from "@/constants/placeholder-places";
import { Spacing } from "@/constants/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

type ButtonProps = {
  label: string;
  icon: IconName;
  type?: ButtonType;
};

const buttondata: ButtonProps[] = [
  {
    label: "Route",
    icon: "location.fill",
    type: "prominent",
  },
  {
    label: "Share",
    icon: "square.and.arrow.up",
  },
  {
    label: "Save",
    icon: "bookmark",
  },
];

/** A single place, opened by tapping it in the Places list */
export default function PlaceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: load the place from real data
  const place = PLACEHOLDER_PLACES.find((item) => item.id === id);

  return (
    <>
      <Stack.Screen
        options={{
          title: place?.name ?? "Place",
          headerTransparent: true,
          headerLargeTitleEnabled: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <ScreenScrollView contentContainerStyle={styles.content}>
        {place ? (
          <>
            <PlaceMeta
              author={place.author}
              distance={place.distance}
              visited={place.visited}
            />
            {place.image && (
              <ImageCarousel images={[place.image]} aspectRatio={5 / 4} />
            )}
            <View style={styles.row}>
              {buttondata.map((button) => (
                <ThemedButton
                  key={button.label}
                  icon={button.icon}
                  label={button.label}
                  type={button.type ?? "tertiary"}
                  size="large"
                  fullWidth
                  radius="md"
                  // Share the row's width equally
                  style={styles.rowButton}
                />
              ))}
            </View>
            <ThemedCheckItem
              label={place.visited ? "Visited" : "Not visited"}
              type={place.visited ? "prominent" : "tertiary"}
              size="large"
              fullWidth
              radius="md"
            />
            <Rating value={place.rating} size={18} />
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
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  rowButton: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  notFound: {
    textAlign: "center",
  },
});
