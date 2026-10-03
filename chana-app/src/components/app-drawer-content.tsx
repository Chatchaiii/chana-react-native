import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerProgress,
} from "expo-router/drawer";
import { DrawerActions } from "expo-router/react-navigation";
import { StyleSheet, View } from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

function playDrawerHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
}

/** Plays a haptic each time the drawer snaps fully open or fully closed. */
function useDrawerHaptics() {
  const progress = useDrawerProgress();
  // 0 = closed, 1 = open
  const settled = useSharedValue(0);

  useAnimatedReaction(
    () => progress.get(),
    (value) => {
      const next = value >= 0.99 ? 1 : value <= 0.01 ? 0 : null;
      if (next !== null && next !== settled.get()) {
        settled.set(next);
        scheduleOnRN(playDrawerHaptic);
      }
    },
  );
}

export function AppDrawerContent(props: DrawerContentComponentProps) {
  const { state, navigation } = props;
  const focusedRoute = state.routes[state.index]?.name;
  useDrawerHaptics();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={{ gap: Spacing.two }}>
        <ThemedText type="heading_2">Chana</ThemedText>
      </View>

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
              shape="rounded"
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
