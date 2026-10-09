import { useSession } from "@/data/session";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/hooks/use-theme";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

/** Root: the app when signed in, the welcome / sign-in flow when not */
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const signedIn = useSession() !== null;

  return (
    // Painted in the menu color so the main screen's rounded corners blend into the menu
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.menu }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.menu },
            }}
          >
            {/* Only one group is reachable at a time; signing in or out swaps them */}
            <Stack.Protected guard={signedIn}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
            <Stack.Protected guard={!signedIn}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
