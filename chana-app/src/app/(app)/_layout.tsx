import { AppDrawerContent } from "@/components/app-drawer-content";
import { Tabs } from "@/constants/tabs";
import { useTheme } from "@/hooks/use-theme";
import { Drawer } from "expo-router/drawer";
import { getFocusedRouteNameFromRoute } from "expo-router/react-navigation";
import { useWindowDimensions } from "react-native";

// The menu takes 80% of the screen, but no more than this (e.g. in landscape)
const DRAWER_MAX_WIDTH = 360;

/** The signed-in app: a side menu with one screen per tab */
export default function AppLayout() {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <Drawer
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        // Menu stays behind; the main screen slides over it (Claude/Threads style)
        drawerType: "back",
        drawerStyle: {
          width: Math.min(width * 0.8, DRAWER_MAX_WIDTH),
          backgroundColor: theme.menu,
          borderRightWidth: 0,
        },
        // The rounding and fade are drawn by DrawerStack (components/drawer-stack.tsx)
        sceneStyle: { backgroundColor: theme.menu },
        overlayColor: "transparent",
      }}
    >
      {Object.values(Tabs).map((tab) => (
        <Drawer.Screen
          key={tab.route}
          name={tab.route}
          options={({ route }) => ({
            drawerLabel: tab.title,
            // Only swipe the menu open from a tab's main page; on pushed
            // pages the left-edge swipe belongs to the back gesture
            swipeEnabled:
              (getFocusedRouteNameFromRoute(route) ?? "index") === "index",
          })}
        />
      ))}
    </Drawer>
  );
}
