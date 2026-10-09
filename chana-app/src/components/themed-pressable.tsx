import { PressSpring } from "@/constants/motion";
import { HapticStyles, playHaptic } from "@/utils/haptics";
import type { ImpactFeedbackStyle } from "expo-haptics";
import { useRef } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export type ThemedPressableProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
  /** Haptic played on press; false turns it off */
  haptic?: ImpactFeedbackStyle | false;
};

const PRESSED_SCALE = 0.98;
const PRESSED_OPACITY = 0.7;
const DISABLED_OPACITY = 0.4;
// A press whose finger travelled further than this on screen was a swipe
const TAP_SLOP = 10;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Unstyled pressable with the app's press feel: haptic, scale and dim while
 * pressed, and dimmed when disabled. Wrap any content to make it tappable.
 */
export function ThemedPressable({
  haptic = HapticStyles.press,
  disabled,
  style,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: ThemedPressableProps) {
  const pressed = useSharedValue(0);
  // Where on screen the finger went down
  const pressStart = useRef<{ x: number; y: number } | null>(null);

  // Shrinks and dims while pressed, on the UI thread
  const animatedStyle = useAnimatedStyle(() => ({
    opacity:
      (disabled ? DISABLED_OPACITY : 1) *
      interpolate(pressed.get(), [0, 1], [1, PRESSED_OPACITY]),
    transform: [
      { scale: interpolate(pressed.get(), [0, 1], [1, PRESSED_SCALE]) },
    ],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...rest}
      disabled={disabled}
      onPressIn={(event) => {
        pressStart.current = {
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };
        pressed.set(withSpring(1, PressSpring));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withSpring(0, PressSpring));
        onPressOut?.(event);
      }}
      onPress={(event) => {
        const start = pressStart.current;
        pressStart.current = null;
        // When the item moves along with the finger (the screen sliding aside
        // as the drawer is swiped open), the finger never leaves it and RN
        // counts a tap. On screen it travelled far, so it was a swipe
        if (
          start &&
          Math.hypot(
            event.nativeEvent.pageX - start.x,
            event.nativeEvent.pageY - start.y,
          ) > TAP_SLOP
        ) {
          return;
        }
        if (haptic !== false) playHaptic(haptic);
        onPress?.(event);
      }}
      style={[style, animatedStyle]}
    />
  );
}
