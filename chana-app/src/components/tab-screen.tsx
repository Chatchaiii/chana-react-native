import { Avatar } from "@/components/avatar";
import { HeaderButton } from "@/components/header-button";
import { MenuButton } from "@/components/menu-button";
import { SearchResults } from "@/components/search-results";
import type { Tab } from "@/constants/tabs";
import { CURRENT_USER } from "@/data/current-user";
import { useMaterialSymbolSource } from "@/hooks/use-material-symbol-source";
import { HapticStyles, playHaptic } from "@/utils/haptics";
import { Stack, useRouter, type Href } from "expo-router";
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
 * Search is global; only the create button (if the tab has one) differs per tab.
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

  const { create } = tab;

  const openCreate = (href: Href) => {
    // Native toolbar buttons aren't ThemedPressables, so play the haptic here
    playHaptic(HapticStyles.press);
    router.push(href);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: title,
          headerTransparent: true,
          headerLeft: () => <MenuButton />,
          headerRight: () => (
            <HeaderButton
              accessibilityLabel="Profile"
              onPress={() => router.push(tab.profileHref)}
            >
              <Avatar src={CURRENT_USER.avatar} name={CURRENT_USER.name} />
            </HeaderButton>
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
        {create && createIcon ? (
          <Stack.Toolbar.Button
            icon={createIcon}
            accessibilityLabel={create.label}
            onPress={() => openCreate(create.href)}
          />
        ) : null}
      </Stack.Toolbar>

      {query.trim() ? <SearchResults query={query} /> : children}
    </>
  );
}
