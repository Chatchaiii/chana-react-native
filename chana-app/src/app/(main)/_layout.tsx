import { DrawerStack, SheetScreenOptions } from "@/components/drawer-stack";
import { Stack } from "expo-router";

export { unstable_settings } from "@/components/drawer-stack";

export default function HomeLayout() {
  return (
    <DrawerStack>
      <Stack.Screen name="post/[id]/options" options={SheetScreenOptions} />
    </DrawerStack>
  );
}
