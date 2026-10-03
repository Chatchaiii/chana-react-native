import * as Haptics from "expo-haptics";
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
  haptic?: Haptics.ImpactFeedbackStyle | false;
};

const PRESSED_SCALE = 0.98;
const PRESSED_OPACITY = 0.7;
const DISABLED_OPACITY = 0.4;
const PRESS_SPRING = { stiffness: 300, damping: 30 };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Unstyled pressable with the app's press feel: haptic, scale and dim while
 * pressed, and dimmed when disabled. Wrap any content to make it tappable.
 */
export function ThemedPressable({
  haptic = Haptics.ImpactFeedbackStyle.Medium,
  disabled,
  style,
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: ThemedPressableProps) {
  const pressed = useSharedValue(0);

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
        pressed.set(withSpring(1, PRESS_SPRING));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.set(withSpring(0, PRESS_SPRING));
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (haptic !== false) Haptics.impactAsync(haptic);
        onPress?.(event);
      }}
      style={[style, animatedStyle]}
    />
  );
}
