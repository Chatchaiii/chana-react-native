import { ScreenScrollView } from "@/components/screen-scroll-view";
import { Tabs } from "@/constants/tabs";
import { Stack } from "expo-router";

export default function NewPlaces() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: Tabs.places.create.label }} />
      <ScreenScrollView transparentHeader={false} />
    </>
  );
}
