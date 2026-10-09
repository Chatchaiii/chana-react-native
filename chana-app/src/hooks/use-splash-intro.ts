import { useRef, useState } from "react";
import { useWindowDimensions, type View } from "react-native";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// How big the wordmark starts, centred on the screen
const START_SCALE = 1.6;
// Shown alone for a moment before it moves
const HOLD = 500;
// Damped springs instead of an eased curve, so the motion has some weight:
// the wordmark overshoots its place a touch and settles back
const LAND_SPRING = { duration: 700, dampingRatio: 0.65 };
// Calmer, since the content only fades and rises a little
const CONTENT_SPRING = { duration: 600, dampingRatio: 0.85 };
// The content starts while the wordmark is still landing
const CONTENT_DELAY = HOLD + LAND_SPRING.duration / 3;
// The rest fades in as the wordmark settles, rising this far
const CONTENT_RISE = 16;

// Once per app launch; coming back after signing out skips it
let played = false;

/**
 * Splash for the welcome screen: the wordmark starts big in the middle of the
 * screen, then shrinks and glides up into its place, and the rest fades in.
 * Put `wordmarkRef` / `onWordmarkLayout` / `wordmarkStyle` on an Animated.View
 * around the wordmark (in its final place) and `contentStyle` on the rest.
 */
export function useSplashIntro() {
  const { height } = useWindowDimensions();
  const wordmarkRef = useRef<View>(null);
  const [skip] = useState(() => played);
  // While running, the content ignores taps
  const [running, setRunning] = useState(!skip);
  // How far the wordmark sits above the screen's centre
  const offset = useSharedValue(0);
  const measured = useSharedValue(skip);
  // 0 = splash, 1 = in place
  const progress = useSharedValue(skip ? 1 : 0);
  const content = useSharedValue(skip ? 1 : 0);

  const onWordmarkLayout = () => {
    if (skip || measured.get()) return;
    wordmarkRef.current?.measureInWindow((_x, y, _width, wordmarkHeight) => {
      offset.set(height / 2 - (y + wordmarkHeight / 2));
      measured.set(true);
      played = true;
      progress.set(withDelay(HOLD, withSpring(1, LAND_SPRING)));
      // Starts while the wordmark is still landing, so it feels like one motion
      content.set(
        withDelay(
          CONTENT_DELAY,
          withSpring(1, CONTENT_SPRING, () => scheduleOnRN(setRunning, false)),
        ),
      );
    });
  };

  const wordmarkStyle = useAnimatedStyle(() => ({
    // Hidden until measured, so it never flashes in its final place first
    opacity: measured.get() ? 1 : 0,
    transform: [
      { translateY: offset.get() * (1 - progress.get()) },
      { scale: interpolate(progress.get(), [0, 1], [START_SCALE, 1]) },
    ],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    // The spring may overshoot 1; opacity can't
    opacity: Math.min(content.get(), 1),
    transform: [{ translateY: (1 - content.get()) * CONTENT_RISE }],
  }));

  return {
    wordmarkRef,
    onWordmarkLayout,
    wordmarkStyle,
    contentStyle,
    contentPointerEvents: running ? ("none" as const) : ("auto" as const),
  };
}
