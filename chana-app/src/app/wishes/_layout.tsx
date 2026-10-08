import { DrawerStack, SheetScreenOptions } from "@/components/drawer-stack";
import { Stack } from "expo-router";

export { unstable_settings } from "@/components/drawer-stack";

export default function WishesLayout() {
  return (
    <DrawerStack>
      <Stack.Screen name="[id]" options={SheetScreenOptions} />
    </DrawerStack>
  );
}
