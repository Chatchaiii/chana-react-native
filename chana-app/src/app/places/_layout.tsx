import { DrawerStack } from "@/components/drawer-stack";
import { Stack } from "expo-router";

// Keeps the tab's index underneath when "new" is opened
export const unstable_settings = {
  initialRouteName: "index",
};

export default function PlacesLayout() {
  return (
    <DrawerStack>
      <Stack.Screen name="new" options={{ presentation: "modal" }} />
    </DrawerStack>
  );
}
