import { SheetContent } from "@/components/layout/sheet-content";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Spacing } from "@/constants/theme";
import { setPlaceVisit, usePlaceVisit } from "@/data/place-visits";
import { PLACEHOLDER_PLACES } from "@/data/places";
import type { Place } from "@/types/place";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

/** Sheet to change when a place was visited; the date only applies on Save */
export default function VisitedDateSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: load the place from real data
  const place = PLACEHOLDER_PLACES.find((item) => item.id === id);

  return place ? <VisitedDatePicker place={place} /> : null;
}

function VisitedDatePicker({ place }: { place: Place }) {
  const router = useRouter();
  const visit = usePlaceVisit(place);
  // Picked date, only saved once confirmed; swiping the sheet away discards it
  const [date, setDate] = useState(visit.visitedOn);

  const save = () => {
    setPlaceVisit(place.id, { ...visit, visitedOn: date });
    router.back();
  };

  return (
    <SheetContent style={{ paddingTop: Spacing.three }}>
      <Calendar value={date} onChange={setDate} maximumDate={new Date()} />

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
