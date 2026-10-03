import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Places() {
  return (
    <TabScreen title={Tabs.places.title} create={Tabs.places.create}>
      <ScreenScrollView />
    </TabScreen>
  );
}
