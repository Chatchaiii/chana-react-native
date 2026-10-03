import { ScreenScrollView } from "@/components/screen-scroll-view";
import { Tabs } from "@/constants/tabs";
import { Stack } from "expo-router";

export default function NewPost() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: Tabs.home.create.label }} />
      <ScreenScrollView transparentHeader={false} />
    </>
  );
}
