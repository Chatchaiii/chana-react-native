// RN doesn't cancel a press when the drawer's swipe takes over, so the swipe
// that opens the menu would also tap whatever it started on. While the drawer
// slides, ThemedPressable ignores presses. Set by useDrawerPressGuard
let drawerMoving = false;

export function setDrawerMoving(moving: boolean) {
  drawerMoving = moving;
}

/** Whether a press now is part of a swipe rather than a tap */
export function isPressBlocked() {
  return drawerMoving;
}
