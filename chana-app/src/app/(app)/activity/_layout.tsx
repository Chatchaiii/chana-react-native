import { DrawerStack } from "@/components/drawer-stack";

export { unstable_settings } from "@/components/drawer-stack";

export default function ActivityLayout() {
  return <DrawerStack withCreate={false} />;
}
