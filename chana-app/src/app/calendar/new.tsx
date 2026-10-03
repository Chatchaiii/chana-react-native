import { ScreenScrollView } from "@/components/screen-scroll-view";
import { Tabs } from "@/constants/tabs";
import { Stack } from "expo-router";

export default function NewCalendar() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: Tabs.calendar.create.label }} />
      <ScreenScrollView transparentHeader={false} />
    </>
  );
}
