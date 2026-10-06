import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { useDrawerProgress } from "expo-router/drawer";
import type { NativeStackNavigationOptions } from "expo-router/native-stack";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

const OPEN_BORDER_RADIUS = 44;
const OPEN_FADE_OPACITY = 0.5;

/**
 * Re-exported by every tab's `_layout.tsx`: keeps the tab's index underneath
 * when "new" is opened directly (e.g. via a deep link).
 */
export const unstable_settings = {
  initialRouteName: "index",
};

/** Native iOS sheet sized to its content (a full-screen modal on Android) */
export const SheetScreenOptions: NativeStackNavigationOptions = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetGrabberVisible: true,
  headerShown: false,
};

export type DrawerStackProps = {
  /** Whether the tab has a `new.tsx` (create modal); false for tabs without a create button */
  withCreate?: boolean;
  /** Extra Stack.Screen declarations for routes only this tab has */
  children?: ReactNode;
};

/**
 * Layout of every drawer tab: a Stack with the tab's index, its "new" modal and
 * the profile sheet. Rounds and fades the screen as it slides away to reveal
 * the menu.
 */
export function DrawerStack({ withCreate = true, children }: DrawerStackProps) {
  const theme = useTheme();
  const progress = useDrawerProgress();

  // Rounds the screen and fades in a subtle edge as the menu opens
  const screenStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(progress.get(), [0, 1], [0, OPEN_BORDER_RADIUS]),
    borderColor: interpolateColor(
      progress.get(),
      [0, 1],
      ["transparent", theme.bg3],
    ),
  }));

  // Washes out the screen content while the menu is open
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1], [0, OPEN_FADE_OPACITY]),
  }));

  return (
    <Animated.View
      style={[styles.screen, { backgroundColor: theme.bg1 }, screenStyle]}
    >
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.bg2 },
          // Pushed pages show only the back chevron, without the previous title
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        {/* Declared screens are ordered first, so index must come first to stay the tab's start screen */}
        <Stack.Screen name="index" />
        {/* Declaring a route that doesn't exist warns, so only when the tab has one */}
        {withCreate ? (
          <Stack.Screen name="new" options={{ presentation: "modal" }} />
        ) : null}
        <Stack.Screen name="profile" options={SheetScreenOptions} />
        {children}
      </Stack>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.bg2 },
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
