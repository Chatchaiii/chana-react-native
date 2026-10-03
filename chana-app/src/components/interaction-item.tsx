import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Bookmark02Icon, MessageCircleIcon } from "@hugeicons/core-free-icons";
import { StyleSheet, View } from "react-native";

export type InteractionItemProps = {
  commentCount: number;
  savedCount: number;
  onCommentPress?: () => void;
  onSavePress?: () => void;
};

/** Row of post interactions (comments, saves) with their counts */
export function InteractionItem({
  commentCount,
  savedCount,
  onCommentPress,
  onSavePress,
}: InteractionItemProps) {
  return (
    <View style={styles.row}>
      {onCommentPress && (
        <ThemedPressable
          onPress={onCommentPress}
          hitSlop={8}
          accessibilityLabel={`Comments, ${commentCount}`}
          style={styles.button}
        >
          <ThemedIcon icon={MessageCircleIcon} />
          {/* Explicit check: a bare 0 outside <Text> would crash */}
          {commentCount > 0 && <ThemedText>{commentCount}</ThemedText>}
        </ThemedPressable>
      )}

      {onSavePress && (
        <ThemedPressable
          onPress={onSavePress}
          hitSlop={8}
          accessibilityLabel={`Save, ${savedCount} saved`}
          style={styles.button}
        >
          <ThemedIcon icon={Bookmark02Icon} />
          {savedCount > 0 && <ThemedText>{savedCount}</ThemedText>}
        </ThemedPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
