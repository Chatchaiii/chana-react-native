import { Easing } from "react-native-reanimated";

const easeOut = Easing.out(Easing.cubic);

/** Eased timings for UI transitions: no bounce, quick to settle */
export const Timings = {
  fast: { duration: 180, easing: easeOut },
  normal: { duration: 250, easing: easeOut },
  slow: { duration: 280, easing: easeOut },
};

/**
 * Press feedback like a UIKit button: down almost at once (eased timing), back
 * with a spring, where a little physicality feels right
 */
export const PressIn = { duration: 80, easing: easeOut };
export const PressOut = { stiffness: 300, damping: 30 };

/** Delay before press feedback on rows in scrolling lists, so scrolling doesn't flash them */
export const ListPressDelay = 100;
