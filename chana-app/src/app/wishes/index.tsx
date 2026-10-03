import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";

export default function Wishes() {
  return (
    <TabScreen title={Tabs.wishes.title} create={Tabs.wishes.create}>
      <ScreenScrollView />
    </TabScreen>
  );
}
