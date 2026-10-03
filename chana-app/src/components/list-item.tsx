import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { EllipsisIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

export type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Avatar image URL; falls back to the title's initials */
  avatar?: string;
  /** Shows the trailing "…" button when set */
  onOptionsPress?: () => void;
};

/** Row with an avatar, a title + subtitle and an optional "…" button */
export function ListItem({
  title,
  subtitle,
  avatar,
  onOptionsPress,
}: ListItemProps) {
  return (
    <View style={styles.row}>
      <ThemedAvatar src={avatar} name={title} size="m" />
      <View style={styles.text}>
        <ThemedText type="label">{title}</ThemedText>
        {subtitle && (
          <ThemedText type="sublabel" themeColor="fg2">
            {subtitle}
          </ThemedText>
        )}
      </View>
      {onOptionsPress && (
        <ThemedPressable
          onPress={onOptionsPress}
          hitSlop={12}
          accessibilityLabel="Options"
        >
          <ThemedIcon icon={EllipsisIcon} />
        </ThemedPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    gap: Spacing.three,
  },
  text: {
    flex: 1,
  },
});
