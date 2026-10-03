import { MenuButton } from "@/components/menu-button";
import { SearchResults } from "@/components/search-results";
import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedPressable } from "@/components/themed-pressable";
import { CURRENT_USER } from "@/constants/placeholder-user";
import type { Tab } from "@/constants/tabs";
import { useMaterialSymbolSource } from "@/hooks/use-material-symbol-source";
import { HapticStyles, playHaptic } from "@/utils/haptics";
import { Stack, useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Platform } from "react-native";

export type TabScreenProps = {
  tab: Tab;
  /** Header title; defaults to the tab's title */
  title?: string;
  children?: ReactNode;
};

/**
 * Shared header, search bar and bottom toolbar for every drawer tab.
 * Search is global; only the create button differs per tab.
 */
export function TabScreen({
  tab,
  title = tab.title,
  children,
}: TabScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // Android toolbar buttons need an image; iOS uses an SF Symbol
  const androidCreateIcon = useMaterialSymbolSource("edit_square");
  const createIcon =
    Platform.OS === "android" ? androidCreateIcon : "square.and.pencil";

  const openCreate = () => {
    // Native toolbar buttons aren't ThemedPressables, so play the haptic here
    playHaptic(HapticStyles.press);
    router.push(tab.create.href);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: title,
          headerTransparent: true,
          headerLeft: () => <MenuButton />,
          headerRight: () => (
            <ThemedPressable
              accessibilityLabel="Profile"
              onPress={() => router.push(tab.profileHref)}
            >
              <ThemedAvatar
                src={CURRENT_USER.avatar}
                name={CURRENT_USER.name}
              />
            </ThemedPressable>
          ),
        }}
      />

      <Stack.SearchBar
        placeholder="Search"
        onChangeText={(event) => setQuery(event.nativeEvent.text)}
        onCancelButtonPress={() => setQuery("")}
      />

      <Stack.Toolbar>
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Spacer />
        {/* Rendered once the Android icon has loaded; without one it warns */}
        {createIcon && (
          <Stack.Toolbar.Button
            icon={createIcon}
            accessibilityLabel={tab.create.label}
            onPress={openCreate}
          />
        )}
      </Stack.Toolbar>

      {query.trim() ? <SearchResults query={query} /> : children}
    </>
  );
}
