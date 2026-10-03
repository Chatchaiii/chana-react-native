import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { EllipsisIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

export type ListItemProps = {
  title: string;
  /** Small detail shown right after the title, e.g. "16h ago" */
  addOn?: string;
  subtitle?: string;
  /** Avatar image URL; falls back to the title's initials */
  avatar?: string;
  /** Shows the trailing "…" button when set */
  onOptionsPress?: () => void;
};

/** Row with an avatar, a title + subtitle and an optional "…" button */
export function ListItem({
  title,
  addOn,
  subtitle,
  avatar,
  onOptionsPress,
}: ListItemProps) {
  return (
    <View style={styles.row}>
      <ThemedAvatar src={avatar} name={title} size="m" />
      <View style={styles.text}>
        <View style={styles.titleRow}>
          {/* Truncates first, so a long title never pushes the add-on away */}
          <ThemedText type="label" numberOfLines={1} style={styles.title}>
            {title}
          </ThemedText>
          {/* Ternaries, not &&: an empty string outside <Text> would crash */}
          {addOn ? (
            <ThemedText type="sublabel" themeColor="fg2">
              {addOn}
            </ThemedText>
          ) : null}
        </View>

        {subtitle ? (
          <ThemedText type="sublabel" themeColor="fg2">
            {subtitle}
          </ThemedText>
        ) : null}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  title: {
    flexShrink: 1,
  },
  text: {
    flex: 1,
  },
});
