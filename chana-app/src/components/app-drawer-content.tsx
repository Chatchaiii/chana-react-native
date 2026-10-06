import {
  ThemedButton,
  type ThemedButtonProps,
} from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { MenuSections, type MenuSection } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { useDrawerHaptics } from "@/hooks/use-drawer-haptics";
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { DrawerActions } from "expo-router/react-navigation";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Side menu: app name and one button per tab, grouped by `MenuSections` */
export function AppDrawerContent({
  state,
  navigation,
}: DrawerContentComponentProps) {
  const focusedRoute = state.routes[state.index]?.name;
  const insets = useSafeAreaInsets();
  useDrawerHaptics();

  return (
    // Not scrollable: the menu always fits on screen
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left + Spacing.three,
        },
      ]}
    >
      <ThemedText type="heading_2" style={styles.text}>
        CHANA
      </ThemedText>

      {MenuSections.map((section, index) => (
        <View
          key={index}
          style={[
            sectionStyles[section.variant],
            section.spaceBefore
              ? { marginTop: Spacing[section.spaceBefore] }
              : null,
          ]}
        >
          {section.tabs.map((tab) => {
            const focused = tab.route === focusedRoute;

            return (
              <ThemedButton
                key={tab.route}
                icon={tab.icon}
                label={tab.title}
                type={focused ? "primary" : "secondary"}
                {...buttonProps[section.variant]}
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
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    marginBottom: Spacing.three,
  },
  container: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  rowButton: {
    flex: 1,
  },
});

/** Layout of each section variant */
const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
});

/** Button look per section variant: row = side-by-side tiles, list = full-width rows */
const buttonProps = {
  row: {
    size: "medium_1",
    radius: "sm",
    fullWidth: true,
    style: styles.rowButton,
  },
  list: { size: "medium_2", radius: "md", align: "left", fullWidth: true },
} satisfies Record<MenuSection["variant"], Partial<ThemedButtonProps>>;
