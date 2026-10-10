import { ScreenScrollView } from "@/components/layout/screen-scroll-view";
import { TabScreen } from "@/components/layout/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Calendar() {
  return (
    <TabScreen tab={Tabs.calendar}>
      <ScreenScrollView />
    </TabScreen>
  );
}
