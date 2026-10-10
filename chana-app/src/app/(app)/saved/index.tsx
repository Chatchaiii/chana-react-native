import { ScreenScrollView } from "@/components/layout/screen-scroll-view";
import { TabScreen } from "@/components/layout/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Saved() {
  return (
    <TabScreen tab={Tabs.saved}>
      <ScreenScrollView />
    </TabScreen>
  );
}
