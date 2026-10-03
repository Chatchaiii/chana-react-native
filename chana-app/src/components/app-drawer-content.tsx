import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
} from "expo-router/drawer";
import { DrawerActions } from "expo-router/react-navigation";
import { StyleSheet, View } from "react-native";

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;
  const focusedRoute = state.routes[state.index]?.name;

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <ThemedText type="subtitle" style={styles.title}>
        Chana
      </ThemedText>
      <View style={styles.items}>
        {Object.values(Tabs).map((tab) => {
          const focused = tab.route === focusedRoute;

          return (
            <ThemedButton
              key={tab.route}
              icon={tab.icon}
              label={tab.title}
              type={focused ? "primary" : "default"}
              align="left"
              size="medium_2"
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
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  title: {
    paddingHorizontal: Spacing.two,
  },
  items: {
    gap: Spacing.one,
  },
});
