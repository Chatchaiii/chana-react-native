import { Easing } from "react-native-reanimated";

const easeOut = Easing.out(Easing.cubic);

/** Eased timings for UI transitions: no bounce, quick to settle */
export const Timings = {
  fast: { duration: 180, easing: easeOut },
  normal: { duration: 250, easing: easeOut },
  slow: { duration: 280, easing: easeOut },
};

/** Spring for press feedback, where a little physicality feels right */
export const PressSpring = { stiffness: 300, damping: 30 };
