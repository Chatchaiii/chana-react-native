import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import type { NativeStackNavigationOptions } from "expo-router/native-stack";
import type { ReactNode } from "react";

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

export type TabStackProps = {
  /** Whether the tab has a `new.tsx` (create modal); false for tabs without a create button */
  withCreate?: boolean;
  /** Extra Stack.Screen declarations for routes only this tab has */
  children?: ReactNode;
};

/**
 * Layout of every tab: a Stack with the tab's index, its "new" modal and the
 * profile sheet. The SideDrawer around all tabs slides it aside for the menu.
 */
export function TabStack({ withCreate = true, children }: TabStackProps) {
  const theme = useTheme();

  return (
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
  );
}
