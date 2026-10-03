import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Calendar() {
  return (
    <TabScreen title={Tabs.calendar.title} create={Tabs.calendar.create}>
      <ScreenScrollView />
    </TabScreen>
  );
}
