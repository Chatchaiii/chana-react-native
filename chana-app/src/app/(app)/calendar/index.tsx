import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Calendar() {
  return (
    <TabScreen tab={Tabs.calendar}>
      <ScreenScrollView />
    </TabScreen>
  );
}
