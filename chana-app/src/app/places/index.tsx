import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Places() {
  return (
    <TabScreen tab={Tabs.places}>
      <ScreenScrollView />
    </TabScreen>
  );
}
