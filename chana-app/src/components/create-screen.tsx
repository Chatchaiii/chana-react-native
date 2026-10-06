import { ScreenScrollView } from "@/components/screen-scroll-view";
import type { CreatableTab } from "@/constants/tabs";
import { Stack } from "expo-router";

export type CreateScreenProps = {
  tab: CreatableTab;
};

/** Modal opened by a tab's create button (each tab's `new.tsx`) */
export function CreateScreen({ tab }: CreateScreenProps) {
  return (
    <>
      <Stack.Screen options={{ headerTitle: tab.create.label }} />
      <ScreenScrollView transparentHeader={false} />
    </>
  );
}
