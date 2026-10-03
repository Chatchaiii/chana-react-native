import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Menu02Icon } from "@hugeicons/core-free-icons";
import { Stack } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
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

      <SafeAreaView>
        <View style={styles.body}>
          <ThemedText>Welcome to Chana!</ThemedText>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    gap: Spacing.five,
  },
  row_3: {
    flexDirection: "row",
    gap: Spacing.three,
  },
});
