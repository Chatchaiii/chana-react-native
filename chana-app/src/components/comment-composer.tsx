import { Button, ButtonIconSizes } from "@/components/button";
import { TextStyles } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Lines the input grows to before it scrolls
const MAX_LINES = 6;
// Height of the icon-only medium_1 send button, so field and button line up
const ROW_HEIGHT = Spacing.three * 2 + ButtonIconSizes.medium_1;
const BAR_PADDING = Spacing.three;

export type CommentComposerProps = {
  /** Called with the trimmed text; the field clears itself */
  onSend: (text: string) => void;
};

/**
 * Bar at the bottom of a post for writing a comment: a growing input and a
 * round send button that's enabled once there's text. Place it below the
 * screen's ScrollView; it follows the keyboard frame by frame as it opens,
 * closes or is dragged down.
 */
export function CommentComposer({ onSend }: CommentComposerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();
  const [text, setText] = useState("");
  const canSend = text.trim().length > 0;

  // Sits on top of the keyboard, or above the home indicator while it's closed
  const keyboardStyle = useAnimatedStyle(() => ({
    paddingBottom:
      BAR_PADDING +
      Math.max(keyboard.height.get(), insets.bottom - BAR_PADDING),
  }));

  const send = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <Animated.View
      style={[
        styles.bar,
        { backgroundColor: theme.bg2, borderTopColor: theme.bg3 },
        keyboardStyle,
      ]}
    >
      <View style={[styles.field, { backgroundColor: theme.bg3 }]}>
        <ThemedTextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a comment…"
          multiline
          accessibilityLabel="Comment"
          style={styles.input}
        />
      </View>

      <Button
        icon="arrow.up"
        type="prominent"
        size="medium_1"
        radius="full"
        disabled={!canSend}
        accessibilityLabel="Send comment"
        onPress={send}
        style={styles.send}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: Spacing.two,
    paddingTop: BAR_PADDING,
    paddingHorizontal: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  field: {
    flex: 1,
    justifyContent: "center",
    minHeight: ROW_HEIGHT,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: ROW_HEIGHT / 2,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  input: {
    maxHeight: TextStyles.text.lineHeight * MAX_LINES,
  },
  send: {
    // Stays at the bottom while the field grows (Button pins itself to the top)
    alignSelf: "flex-end",
  },
});
