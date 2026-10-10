import { Button } from "@/components/ui/button";
import { SheetContent } from "@/components/layout/sheet-content";
import { Spacing } from "@/constants/theme";
import { setPlaceVisit, usePlaceVisit } from "@/data/place-visits";
import { PLACEHOLDER_PLACES } from "@/data/places";
import { useTheme } from "@/hooks/use-theme";
import type { Place } from "@/types/place";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

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
  // The calendar only measures its height when it renders, and the sheet's
  // width settles after mount, which left it too tall until a date was picked.
  // Passing it the container's width re-renders (and re-measures) it on change
  const [width, setWidth] = useState(0);

  const save = () => {
    setPlaceVisit(place.id, { ...visit, visitedOn: date });
    router.back();
  };

  return (
    <SheetContent style={{ paddingTop: Spacing.three }}>
      <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 ? (
          <DateTimePicker
            value={date}
            mode="date"
            display="inline"
            presentation="inline"
            maximumDate={new Date()}
            accentColor={theme.acc1}
            onValueChange={(_, next) => setDate(next)}
            style={{ width }}
          />
        ) : null}
      </View>

      <Button
        icon="arrow.up"
        label="Update"
        type="primary"
        size="medium_2"
        radius="md"
        fullWidth
        onPress={save}
      />
    </SheetContent>
  );
}
