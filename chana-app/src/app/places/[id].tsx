import { DatePickerButton } from "@/components/date-picker-button";
import { ImageCarousel } from "@/components/image-carousel";
import { PlaceMeta, type Place } from "@/components/place-item";
import { RatingSummary } from "@/components/rating-summary";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { ThemedButton, type ButtonType } from "@/components/themed-button";
import { ThemedCheckItem } from "@/components/themed-check-item";
import { ThemedText } from "@/components/themed-text";
import type { IconName } from "@/constants/icons.generated";
import { PLACEHOLDER_PLACES } from "@/constants/placeholder-places";
import { CURRENT_USER } from "@/constants/placeholder-user";
import { Spacing } from "@/constants/theme";
import { withUserRating } from "@/utils/ratings";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
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
          // Keyed by id: if this screen shows another place, its state starts fresh
          <PlaceContent key={place.id} place={place} />
        ) : (
          <ThemedText themeColor="fg2" style={styles.notFound}>
            This place doesn’t exist anymore.
          </ThemedText>
        )}
      </ScreenScrollView>
    </>
  );
}

function PlaceContent({ place }: { place: Place }) {
  // TODO: save the visited state and ratings once places come from real data
  const [visited, setVisited] = useState(place.visited ?? false);
  const [visitedOn, setVisitedOn] = useState(() => new Date());
  const [ratings, setRatings] = useState(place.ratings);

  return (
    <>
      <PlaceMeta
        author={place.author}
        distance={place.distance}
        visited={visited}
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
        checked={visited}
        onPress={() => setVisited((current) => !current)}
        label={visited ? "Visited" : "Mark as visited"}
        sublabel={visited ? "When were you there?" : "Tap to mark as visited"}
      >
        {visited ? (
          <DatePickerButton
            value={visitedOn}
            onChange={setVisitedOn}
            maximumDate={new Date()}
            accessibilityLabel="Visited on"
          />
        ) : null}
      </ThemedCheckItem>

      <RatingSummary
        ratings={ratings}
        currentUser={CURRENT_USER.name}
        onRate={(value) =>
          setRatings((current) =>
            withUserRating(current, CURRENT_USER.name, value),
          )
        }
      />
      <ThemedText themeColor="fg2">{place.description}</ThemedText>
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
