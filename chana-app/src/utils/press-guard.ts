import type { SharedValue } from "react-native-reanimated";

// RN doesn't cancel a press when the drawer's swipe takes over, so the swipe
// that moves the drawer would also show press feedback on, and then tap,
// whatever it started on. While a finger drags the drawer, the pressable under
// it drops its feedback and ThemedPressable ignores presses. Set by SideDrawer

// The finger's press arrives a moment after it let go of the drawer
const RELEASE_GRACE = 150;

let blocked = false;
let release: ReturnType<typeof setTimeout> | undefined;
// The press animation of the pressable under the finger, if any
let activePress: SharedValue<number> | null = null;

/** A pressable started showing its press feedback (0 = none, 1 = pressed) */
export function setActivePress(pressed: SharedValue<number>) {
  activePress = pressed;
}

/** Blocks presses while the drawer is dragged, and a short grace after */
export function setPressBlocked(dragging: boolean) {
  clearTimeout(release);
  if (dragging) {
    blocked = true;
    // The finger is on the item, but it isn't pressing it
    activePress?.set(0);
    activePress = null;
  } else {
    release = setTimeout(() => {
      blocked = false;
    }, RELEASE_GRACE);
  }
}

/** Whether a press now is part of a swipe rather than a tap */
export function isPressBlocked() {
  return blocked;
}
