import { setDrawerMoving } from "@/utils/press-guard";
import { useDrawerProgress } from "expo-router/drawer";
import { useEffect } from "react";
import { useAnimatedReaction } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

/**
 * Blocks presses (ThemedPressable) while the drawer is between closed and
 * open, i.e. being swiped or still settling. Must be used inside the drawer
 * (e.g. its content component).
 */
export function useDrawerPressGuard() {
  const progress = useDrawerProgress();

  useAnimatedReaction(
    () => progress.get() > 0.01 && progress.get() < 0.99,
    (moving, previous) => {
      if (moving !== previous) scheduleOnRN(setDrawerMoving, moving);
    },
  );

  // Never left blocking, e.g. when signing out unmounts the drawer mid-slide
  useEffect(() => () => setDrawerMoving(false), []);
}
