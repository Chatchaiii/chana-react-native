import { Button } from "@/components/button";
import { SheetContent } from "@/components/sheet-content";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { setPlaceVisit, usePlaceVisit } from "@/data/place-visits";
import { PLACEHOLDER_PLACES } from "@/data/places";
import { useTheme } from "@/hooks/use-theme";
import type { Place } from "@/types/place";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

/** Sheet to change when a place was visited; the date only applies on Save */
export default function VisitedDateSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: load the place from real data
  const place = PLACEHOLDER_PLACES.find((item) => item.id === id);

  return place ? <VisitedDatePicker place={place} /> : null;
}

function VisitedDatePicker({ place }: { place: Place }) {
  const router = useRouter();
  const theme = useTheme();
  const visit = usePlaceVisit(place);
  // Picked date, only saved once confirmed; swiping the sheet away discards it
  const [date, setDate] = useState(visit.visitedOn);

  const save = () => {
    setPlaceVisit(place.id, { ...visit, visitedOn: date });
    router.back();
  };

  return (
    <SheetContent>
      <ThemedText type="heading_4" themeColor="fg2" style={styles.title}>
        When were you at {place.name}?
      </ThemedText>

      <DateTimePicker
        value={date}
        mode="date"
        display="inline"
        presentation="inline"
        maximumDate={new Date()}
        accentColor={theme.acc1}
        onValueChange={(_, next) => setDate(next)}
      />

      <Button
        icon="checkmark"
        label="Save date"
        type="prominent"
        size="medium_2"
        radius="md"
        fullWidth
        onPress={save}
      />
    </SheetContent>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: Spacing.two,
  },
});
