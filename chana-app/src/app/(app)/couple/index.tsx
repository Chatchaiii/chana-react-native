import { ScreenScrollView } from "@/components/layout/screen-scroll-view";
import { TabScreen } from "@/components/layout/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Couple() {
  return (
    <TabScreen tab={Tabs.couple}>
      <ScreenScrollView />
    </TabScreen>
  );
}
