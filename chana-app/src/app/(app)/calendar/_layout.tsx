import { SheetScreenOptions, TabStack } from "@/components/layout/tab-stack";
import { Stack } from "expo-router";

export { unstable_settings } from "@/components/layout/tab-stack";

export default function CalendarLayout() {
  return (
    <TabStack>
      {/* Posts and places open inside the calendar too, with their sheets */}
      <Stack.Screen name="post/[id]/options" options={SheetScreenOptions} />
      <Stack.Screen
        name="places/[id]/visited-date"
        options={SheetScreenOptions}
      />
    </TabStack>
  );
}
