import { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Animated bottom padding that keeps content `gap` above the keyboard, frame
 * by frame as it opens, closes or is dragged down, and above the home
 * indicator while it's closed. Put it on the view whose bottom should follow
 */
export function useKeyboardPadding(gap: number) {
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  return useAnimatedStyle(() => ({
    paddingBottom: gap + Math.max(keyboard.height.get(), insets.bottom - gap),
  }));
}
