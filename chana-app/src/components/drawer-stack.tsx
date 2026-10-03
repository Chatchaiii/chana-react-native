import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { useDrawerProgress } from "expo-router/drawer";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

const OPEN_BORDER_RADIUS = 44;
const OPEN_FADE_OPACITY = 0.5;

export type DrawerStackProps = {
  /** Stack.Screen elements, e.g. to present a route as a modal */
  children?: ReactNode;
};

/**
 * Stack used as the layout of every drawer screen. Rounds and fades the
 * screen as it slides away to reveal the menu behind it.
 */
export function DrawerStack({ children }: DrawerStackProps) {
  const theme = useTheme();
  const progress = useDrawerProgress();

  // Rounds the screen and fades in a subtle edge as the menu opens
  const screenStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(progress.value, [0, 1], [0, OPEN_BORDER_RADIUS]),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ["transparent", theme.bg3],
    ),
  }));

  // Washes out the screen content while the menu is open
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, OPEN_FADE_OPACITY]),
  }));

  return (
    <Animated.View
      style={[styles.screen, { backgroundColor: theme.bg1 }, screenStyle]}
    >
      <Stack screenOptions={{ contentStyle: { backgroundColor: theme.bg1 } }}>
        {/* Declared screens are ordered first, so index must come first to stay the tab's start screen */}
        <Stack.Screen name="index" />
        {children}
      </Stack>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.bg1 },
          fadeStyle,
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
