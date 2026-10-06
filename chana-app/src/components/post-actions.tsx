import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export type PostActionsProps = {
  commentCount: number;
  savedCount: number;
  onCommentPress?: () => void;
  onSavePress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Right-aligned comment and save buttons of a post, with their counts */
export function PostActions({
  commentCount,
  savedCount,
  onCommentPress,
  onSavePress,
  style,
}: PostActionsProps) {
  return (
    <View style={[styles.row, style]}>
      {onCommentPress && (
        <ThemedPressable
          onPress={onCommentPress}
          hitSlop={8}
          accessibilityLabel={`Comments, ${commentCount}`}
          style={styles.button}
        >
          <ThemedIcon icon="message" />
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
          <ThemedIcon icon="bookmark" />
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
    gap: Spacing.three,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
});
