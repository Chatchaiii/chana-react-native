import { Button, type ButtonType } from "@/components/button";
import { CheckItem } from "@/components/check-item";
import { EmptyState } from "@/components/empty-state";
import { ImageCarousel } from "@/components/image-carousel";
import { PlaceMeta } from "@/components/place-item";
import { RatingSummary } from "@/components/rating-summary";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { ThemedText } from "@/components/themed-text";
import type { IconName } from "@/constants/icons.generated";
import { Spacing } from "@/constants/theme";
import { CURRENT_USER } from "@/data/current-user";
import { setPlaceVisit, usePlaceVisit } from "@/data/place-visits";
import { PLACEHOLDER_PLACES } from "@/data/places";
import type { Place } from "@/types/place";
import { formatDate } from "@/utils/dates";
import { withUserRating } from "@/utils/ratings";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

type PlaceAction = {
  label: string;
  icon: IconName;
  type?: ButtonType;
};

// TODO: give each action an onPress once they're implemented
const PlaceActions: PlaceAction[] = [
  { label: "Route", icon: "location.fill", type: "prominent" },
  { label: "Share", icon: "square.and.arrow.up" },
  { label: "Save", icon: "bookmark" },
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
        }}
      />
      <ScreenScrollView contentContainerStyle={styles.content}>
        {place ? (
          // Keyed by id: if this screen shows another place, its state starts fresh
          <PlaceContent key={place.id} place={place} />
        ) : (
          <EmptyState>This place doesn’t exist anymore.</EmptyState>
        )}
      </ScreenScrollView>
    </>
  );
}

function PlaceContent({ place }: { place: Place }) {
  const router = useRouter();
  const { visited, visitedOn } = usePlaceVisit(place);
  // TODO: save ratings once places come from real data
  const [ratings, setRatings] = useState(place.ratings);

  const toggleVisited = () => {
    if (!visited) {
      setPlaceVisit(place.id, { visited: true, visitedOn: new Date() });
      return;
    }
    // Removing a visit loses its date, so ask first
    Alert.alert(
      "Remove visit?",
      `${place.name} will be marked as not visited.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setPlaceVisit(place.id, { visited: false, visitedOn }),
        },
      ],
    );
  };

  return (
    <>
      <PlaceMeta
        author={place.author}
        distance={place.distance}
        visited={visited}
      />
      {place.image ? (
        <ImageCarousel images={[place.image]} aspectRatio={5 / 4} />
      ) : null}

      <View style={styles.actions}>
        {PlaceActions.map((action) => (
          <Button
            key={action.label}
            icon={action.icon}
            label={action.label}
            type={action.type ?? "tertiary"}
            size="large"
            radius="md"
            fullWidth
            // Share the row's width equally
            style={styles.action}
          />
        ))}
      </View>

      <CheckItem
        checked={visited}
        onPress={toggleVisited}
        label={visited ? "Visited" : "Mark as visited"}
        sublabel={visited ? "When were you there?" : "Tap to mark as visited"}
      >
        {visited ? (
          // The date is changed in a sheet with a calendar and a Save button
          <Button
            icon="calendar"
            label={formatDate(visitedOn)}
            size="small"
            radius="full"
            bg="bg2"
            accessibilityLabel={`Visited on ${formatDate(visitedOn)}, change date`}
            onPress={() =>
              router.push({
                pathname: "/places/[id]/visited-date",
                params: { id: place.id },
              })
            }
          />
        ) : null}
      </CheckItem>

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
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  action: {
    flex: 1,
  },
});
