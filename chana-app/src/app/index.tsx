import { ScreenScrollView } from "@/components/screen-scroll-view";
import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Menu02Icon } from "@hugeicons/core-free-icons";
import { Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function Index() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <Pressable onPress={() => console.log("Menu pressed")} hitSlop={8}>
              <ThemedIcon icon={Menu02Icon} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => console.log("Menu pressed")} hitSlop={8}>
              <ThemedAvatar />
            </Pressable>
          ),
        }}
      />

      <Stack.SearchBar
        placeholder="Search"
        onChangeText={(e) => console.log("Search:", e.nativeEvent.text)}
      />

      <Stack.Toolbar>
        <Stack.Toolbar.SearchBarSlot />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon="square.and.pencil"
          onPress={() => console.log("Compose pressed")}
        />
      </Stack.Toolbar>

      <ScreenScrollView contentContainerStyle={styles.body}>
        <ThemedText>Welcome to Chana!</ThemedText>
      </ScreenScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.five,
  },
  row_3: {
    flexDirection: "row",
    gap: Spacing.three,
  },
});
