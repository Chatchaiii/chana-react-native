import { ScreenScrollView } from "@/components/screen-scroll-view";
import { Tabs } from "@/constants/tabs";
import { Stack } from "expo-router";

export default function NewWishes() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: Tabs.wishes.create.label }} />
      <ScreenScrollView transparentHeader={false} />
    </>
  );
}
