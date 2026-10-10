import { AppMenu } from "@/components/app-menu";
import { SideDrawer } from "@/components/side-drawer";
import { Tabs } from "@/constants/tabs";
import { getFocusedRouteNameFromRoute } from "expo-router/react-navigation";
import {
  TabList,
  Tabs as TabsNavigator,
  TabSlot,
  TabTrigger,
  useTabTrigger,
} from "expo-router/ui";
import { StyleSheet } from "react-native";

// The tab the app opens on
export const unstable_settings = {
  initialRouteName: Tabs.home.route,
};

const TABS = Object.values(Tabs);

/**
 * The signed-in app: the tabs (each a stack that keeps its place while
 * another is shown) inside a SideDrawer, with the menu underneath
 */
export default function AppLayout() {
  return (
    <TabsNavigator>
      <AppDrawer />
      {/* Only declares the tabs' routes; the menu's buttons do the switching */}
      <TabList style={styles.hidden}>
        {TABS.map((tab) => (
          <TabTrigger key={tab.route} name={tab.route} href={tab.href} />
        ))}
      </TabList>
    </TabsNavigator>
  );
}

/** The drawer around the current tab */
function AppDrawer() {
  const { getTrigger } = useTabTrigger({ name: Tabs.home.route });
  const current = TABS.map((tab) => getTrigger(tab.route)).find(
    (trigger) => trigger?.isFocused,
  );
  // Only swipe the menu open from a tab's main page; on pushed pages a swipe
  // to the right belongs to the back gesture
  const onTabRoot =
    !current ||
    (getFocusedRouteNameFromRoute(current.route) ?? "index") === "index";

  return (
    <SideDrawer menu={<AppMenu />} swipeEnabled={onTabRoot}>
      <TabSlot />
    </SideDrawer>
  );
}

const styles = StyleSheet.create({
  hidden: {
    display: "none",
  },
});
