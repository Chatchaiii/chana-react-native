import { DrawerStack, SheetScreenOptions } from "@/components/drawer-stack";
import { Stack } from "expo-router";

export { unstable_settings } from "@/components/drawer-stack";

export default function PlacesLayout() {
  return (
    <DrawerStack>
      <Stack.Screen name="[id]/visited-date" options={SheetScreenOptions} />
    </DrawerStack>
  );
}
