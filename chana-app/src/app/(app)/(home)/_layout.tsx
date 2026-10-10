import { TabStack, SheetScreenOptions } from "@/components/tab-stack";
import { Stack } from "expo-router";

export { unstable_settings } from "@/components/tab-stack";

export default function HomeLayout() {
  return (
    <TabStack>
      <Stack.Screen name="post/[id]/options" options={SheetScreenOptions} />
    </TabStack>
  );
}
