import { TabStack } from "@/components/layout/tab-stack";

export { unstable_settings } from "@/components/layout/tab-stack";

export default function ActivityLayout() {
  return <TabStack withCreate={false} />;
}
