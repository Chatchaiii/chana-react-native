import { SearchResults } from "@/components/layout/search-results";
import { useDrawer } from "@/components/layout/side-drawer";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/ui/themed-pressable";
import type { Tab } from "@/constants/tabs";
import { ContainerSizes } from "@/constants/theme";
import { CURRENT_USER } from "@/data/current-user";
import { useMaterialSymbolSource } from "@/hooks/use-material-symbol-source";
import { useTheme } from "@/hooks/use-theme";
import { HapticStyles, playHaptic } from "@/utils/haptics";
import { Stack, useRouter, type Href } from "expo-router";
import { useState, type ReactNode } from "react";
import { Platform, StyleSheet } from "react-native";

export type TabScreenProps = {
  tab: Tab;
  /** Header title; defaults to the tab's title */
  title?: string;
  children?: ReactNode;
};

/**
 * Shared header, search bar and bottom toolbar for every tab.
 * Search is global; only the create button (if the tab has one) differs per tab.
 */
export function TabScreen({
  tab,
  title = tab.title,
  children,
}: TabScreenProps) {
  const router = useRouter();
  const drawer = useDrawer();
  const [query, setQuery] = useState("");
  // Android toolbar buttons need an image; iOS uses an SF Symbol
  const androidCreateIcon = useMaterialSymbolSource("create");
  const createIcon = Platform.OS === "android" ? androidCreateIcon : "plus";

  const { create } = tab;

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
            <HeaderButton accessibilityLabel="Menu" onPress={drawer.open}>
              <Icon icon="line.3.horizontal" />
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

/**
 * Tappable area for a custom header button. iOS draws a glass circle around
 * header items; the pressable fills it (36pt = the circle minus its padding),
 * so taps on the circle don't fall through to the header, which scrolls to top
 */
function HeaderButton({ style, ...rest }: ThemedPressableProps) {
  return <ThemedPressable {...rest} style={[styles.button, style]} />;
}

const styles = StyleSheet.create({
  button: {
    width: ContainerSizes.s,
    height: ContainerSizes.s,
    alignItems: "center",
    justifyContent: "center",
  },
});
