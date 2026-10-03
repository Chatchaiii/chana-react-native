import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { EllipsisIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

export type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Avatar image URL; falls back to the title's initials */
  avatar?: string;
};

/** Row with an avatar, a title + subtitle and a trailing icon */
export function ListItem({ title, subtitle, avatar }: ListItemProps) {
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
      <ThemedIcon icon={EllipsisIcon} />
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
