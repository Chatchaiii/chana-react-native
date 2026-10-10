import { TabStack } from "@/components/tab-stack";

export { unstable_settings } from "@/components/tab-stack";

export default function ActivityLayout() {
  return <TabStack withCreate={false} />;
}
