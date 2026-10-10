import { TabStack, SheetScreenOptions } from "@/components/layout/tab-stack";
import { Stack } from "expo-router";

export { unstable_settings } from "@/components/layout/tab-stack";

export default function WishesLayout() {
  return (
    <TabStack>
      <Stack.Screen name="[id]" options={SheetScreenOptions} />
    </TabStack>
  );
}
