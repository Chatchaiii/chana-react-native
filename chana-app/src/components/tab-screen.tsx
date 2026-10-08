import { Avatar } from "@/components/avatar";
import { HeaderButton } from "@/components/header-button";
import { SearchResults } from "@/components/search-results";
import type { Tab } from "@/constants/tabs";
import { ToolbarIcons } from "@/constants/toolbar-icons.generated";
import { CURRENT_USER } from "@/data/current-user";
import { useMaterialSymbolSource } from "@/hooks/use-material-symbol-source";
import { HapticStyles, playHaptic } from "@/utils/haptics";
import { Stack, useNavigation, useRouter, type Href } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";
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
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  // Android toolbar buttons need an image; iOS uses an SF Symbol
  const androidCreateIcon = useMaterialSymbolSource("edit_square");
  const createIcon =
    Platform.OS === "android" ? androidCreateIcon : "square.and.pencil";

  const { create } = tab;

  // Native toolbar buttons aren't ThemedPressables, so they play the haptic here
  const openMenu = () => {
    playHaptic(HapticStyles.press);
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openCreate = (href: Href) => {
    playHaptic(HapticStyles.press);
    router.push(href);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: title,
          headerTransparent: true,
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

      {/* Native, not a custom headerLeft: on iOS 27 a tap on a custom header
          item also reaches the header, which scrolls the page to the top */}
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button
          // The user's own icon as a PNG, tinted by the system (light/dark)
          icon={ToolbarIcons["line.3.horizontal"]}
          iconRenderingMode="template"
          accessibilityLabel="Open menu"
          onPress={openMenu}
        />
      </Stack.Toolbar>

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
