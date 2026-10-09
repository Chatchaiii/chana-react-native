import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Activity() {
  return (
    <TabScreen tab={Tabs.activity}>
      <ScreenScrollView />
    </TabScreen>
  );
}
