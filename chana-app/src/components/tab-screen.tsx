import { Avatar } from "@/components/avatar";
import { HeaderButton } from "@/components/header-button";
import { SearchResults } from "@/components/search-results";
import { ThemedIcon } from "@/components/themed-icon";
import type { Tab } from "@/constants/tabs";
import { CURRENT_USER } from "@/data/current-user";
import { useMaterialSymbolSource } from "@/hooks/use-material-symbol-source";
import { useTheme } from "@/hooks/use-theme";
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
  const androidCreateIcon = useMaterialSymbolSource("create");
  const createIcon = Platform.OS === "android" ? androidCreateIcon : "plus";

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

  const theme = useTheme();

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
          headerLeft: () => (
            <HeaderButton accessibilityLabel="Profile" onPress={openMenu}>
              <ThemedIcon icon="line.3.horizontal" />
            </HeaderButton>
          ),
          headerSearchBarOptions: {
            autoFocus: true,
            placeholder: "Search",
            onChangeText(e) {
              setQuery(e.nativeEvent.text);
            },
            onCancelButtonPress() {
              setQuery("");
            },
          },
        }}
      />

      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Spacer />
        {create && createIcon ? (
          <Stack.Toolbar.Button
            variant="prominent"
            tintColor={theme.acc1}
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
