import { MenuButton } from "@/components/menu-button";
import { SearchResults } from "@/components/search-results";
import { ThemedAvatar } from "@/components/themed-avatar";
import type { CreateAction } from "@/constants/tabs";
import { useMaterialSymbolSource } from "@/hooks/use-material-symbol-source";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { type ReactNode, useState } from "react";
import { Platform } from "react-native";
import { ThemedPressable } from "./themed-pressable";

export type TabScreenProps = {
  title?: string;
  create: CreateAction;
  children?: ReactNode;
};

/**
 * Shared header, search bar and bottom toolbar for every drawer tab.
 * Search is global; only the create button differs per tab.
 */
export function TabScreen({ title = "", create, children }: TabScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const haptic = Haptics.ImpactFeedbackStyle.Medium;
  // Android toolbar buttons need an image; iOS uses an SF Symbol
  const androidCreateIcon = useMaterialSymbolSource("edit_square");
  const createIcon =
    Platform.OS === "android" ? androidCreateIcon : "square.and.pencil";

  const handlePress = () => {
    Haptics.impactAsync(haptic);
    router.push(create.href);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: title,
          headerTransparent: true,
          headerLeft: () => <MenuButton />,
          headerRight: () => (
            <ThemedPressable onPress={() => console.log("Avatar pressed")}>
              <ThemedAvatar />
            </ThemedPressable>
          ),
        }}
      />

      <Stack.SearchBar
        placeholder="Search"
        onChangeText={(e) => setQuery(e.nativeEvent.text)}
        onCancelButtonPress={() => setQuery("")}
      />

      <Stack.Toolbar>
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Spacer />
        {/* Rendered once the Android icon has loaded; without one it warns */}
        {createIcon && (
          <Stack.Toolbar.Button
            icon={createIcon}
            accessibilityLabel={create.label}
            onPress={handlePress}
          />
        )}
      </Stack.Toolbar>

      {query.trim() ? <SearchResults query={query} /> : children}
    </>
  );
}
