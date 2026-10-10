import { TabStack, SheetScreenOptions } from "@/components/layout/tab-stack";
import { Stack } from "expo-router";

export { unstable_settings } from "@/components/layout/tab-stack";

export default function HomeLayout() {
  return (
    <TabStack>
      <Stack.Screen name="post/[id]/options" options={SheetScreenOptions} />
    </TabStack>
  );
}
