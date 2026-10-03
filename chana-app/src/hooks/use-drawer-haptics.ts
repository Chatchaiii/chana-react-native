import { HapticStyles, playHaptic } from "@/utils/haptics";
import { useDrawerProgress } from "expo-router/drawer";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/**
 * Plays a haptic each time the drawer snaps fully open or fully closed.
 * Must be used inside the drawer (e.g. its content component).
 */
export function useDrawerHaptics() {
  const progress = useDrawerProgress();
  // 0 = closed, 1 = open
  const settled = useSharedValue(0);

  useAnimatedReaction(
    () => progress.get(),
    (value) => {
      const next = value >= 0.99 ? 1 : value <= 0.01 ? 0 : null;
      if (next !== null && next !== settled.get()) {
        settled.set(next);
        scheduleOnRN(playHaptic, HapticStyles.drawer);
      }
    },
  );
}
