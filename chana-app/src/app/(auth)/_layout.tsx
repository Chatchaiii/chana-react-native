import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

// Signing out (or a link into the app while signed out) lands on the welcome screen
export const unstable_settings = {
  initialRouteName: "sign-in",
};

/** Welcome and sign-in steps: one flow for new and existing accounts */
export default function AuthLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitle: "",
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: theme.bg2 },
      }}
    >
      {/* The first screen has nothing to go back to */}
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
    </Stack>
  );
}
