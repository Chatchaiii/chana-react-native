import { TabStack } from "@/components/tab-stack";

export { unstable_settings } from "@/components/tab-stack";

export default function SavedLayout() {
  return <TabStack withCreate={false} />;
}
