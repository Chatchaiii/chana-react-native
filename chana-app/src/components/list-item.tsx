import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { EllipsisIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

/** Row with an avatar, a title + subtitle and a trailing icon. */
export function ListItem() {
  return (
    <View style={styles.item_wrapper}>
      <ThemedAvatar size="m" />
      <View style={{ flex: 1 }}>
        <ThemedText type="label">chadchai</ThemedText>
        <ThemedText type="sublabel" themeColor="fg2">
          2 days ago
        </ThemedText>
      </View>
      <ThemedIcon icon={EllipsisIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  item_wrapper: {
    alignItems: "center",
    flexDirection: "row",
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
