import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { useDrawerHaptics } from "@/hooks/use-drawer-haptics";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "expo-router/drawer";
import { DrawerActions } from "expo-router/react-navigation";
import { StyleSheet, View } from "react-native";

/** Side menu: app name and one button per tab */
export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;
  const focusedRoute = state.routes[state.index]?.name;
  useDrawerHaptics();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <ThemedText type="heading_2">Chana</ThemedText>

      <View style={styles.items}>
        {Object.values(Tabs).map((tab) => {
          const focused = tab.route === focusedRoute;

          return (
            <ThemedButton
              key={tab.route}
              icon={tab.icon}
              label={tab.title}
              type={focused ? "primary" : "default"}
              size="medium_2"
              radius="md"
              align="left"
              fullWidth
              accessibilityState={{ selected: focused }}
              onPress={() =>
                // Tapping the current tab just closes the menu
                focused
                  ? navigation.dispatch(DrawerActions.closeDrawer())
                  : navigation.navigate(tab.route)
              }
            />
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.three,
  },
  items: {
    gap: Spacing.two,
  },
});
