import * as Haptics from "expo-haptics";

/** Haptic strengths used across the app */
export const HapticStyles = {
  press: Haptics.ImpactFeedbackStyle.Medium,
  drawer: Haptics.ImpactFeedbackStyle.Soft,
};

/** Fire-and-forget impact haptic */
export function playHaptic(style: Haptics.ImpactFeedbackStyle) {
  Haptics.impactAsync(style);
}
