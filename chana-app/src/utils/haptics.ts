import * as Haptics from "expo-haptics";

/** Haptics used across the app: impacts for presses, notifications for inputs */
export const HapticStyles = {
  press: Haptics.ImpactFeedbackStyle.Medium,
  drawer: Haptics.ImpactFeedbackStyle.Soft,
  focus: Haptics.NotificationFeedbackType.Success,
  blur: Haptics.NotificationFeedbackType.Warning,
};

/** Fire-and-forget impact haptic */
export function playHaptic(style: Haptics.ImpactFeedbackStyle) {
  Haptics.impactAsync(style);
}

/** Fire-and-forget notification haptic (success, warning, error) */
export function playNotification(style: Haptics.NotificationFeedbackType) {
  Haptics.notificationAsync(style);
}
