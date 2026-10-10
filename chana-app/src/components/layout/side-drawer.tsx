import { DrawerSpring } from "@/constants/motion";
import { useTheme } from "@/hooks/use-theme";
import { HapticStyles, playHaptic } from "@/utils/haptics";
import { isPressBlocked, setPressBlocked } from "@/utils/press-guard";
import {
  createContext,
  use,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  type GestureType,
} from "react-native-gesture-handler";
import Animated, {
  clamp,
  interpolateColor,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// The menu takes this share of the screen, but no more than the max (landscape)
const WIDTH_RATIO = 0.8;
const MAX_WIDTH = 360;
// Sideways travel before the swipe takes over. Less than a ScrollView needs
// to start scrolling, so the drawer gets sideways swipes and lists keep
// vertical ones
const SWIPE_SLOP = 5;
// Where the drawer would coast to at release speed, in seconds of travel: a
// quick flick opens or closes it from anywhere
const FLING_PROJECTION = 0.2;
// The menu starts shifted left by this share of its width and slides into
// place, like the screen under an iOS push
const MENU_PARALLAX = 0.2;
// The screen while the menu is open: rounded, edged and washed out
const OPEN_BORDER_RADIUS = 44;
const OPEN_FADE_OPACITY = 0.5;

type DrawerContextValue = {
  open: () => void;
  close: () => void;
  /** The swipe gesture, for views that must keep it from starting */
  gestureRef: RefObject<GestureType | undefined>;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

/**
 * Opens and closes the side drawer; inside a SideDrawer only. The value never
 * changes, so using it doesn't re-render a screen when the drawer moves
 */
export function useDrawer() {
  const drawer = use(DrawerContext);
  if (!drawer) throw new Error("useDrawer must be used inside a SideDrawer");
  return drawer;
}

const dismissKeyboard = () => Keyboard.dismiss();

export type SideDrawerProps = {
  /** The menu's screen, revealed under the content */
  menu: ReactNode;
  /** Whether swiping right opens the menu; closing by swipe always works */
  swipeEnabled?: boolean;
  /** The app's screens */
  children: ReactNode;
};

/**
 * The app's screens with a menu underneath (Claude / Threads style): swipe
 * right anywhere, or call `useDrawer().open()`, and the screen slides aside
 * to reveal it. The drawer follows the finger and settles with a spring at
 * the finger's speed.
 *
 * Nothing re-renders while it moves: the motion, the tap-to-close overlay and
 * the haptics run on the UI thread, and the one piece of React state
 * (`restsOpen`) only changes once the drawer has come to rest. Rendering at
 * the start of the slide (above all the screens' native headers) made it
 * skip its first frames.
 */
export function SideDrawer({
  menu,
  swipeEnabled = true,
  children,
}: SideDrawerProps) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth * WIDTH_RATIO, MAX_WIDTH);
  // Which end it last came to rest at: sets the swipe's direction (right to
  // open, left to close) and what screen readers can reach
  const [restsOpen, setRestsOpen] = useState(false);
  // A box the gesture library fills with the swipe gesture (via `withRef`),
  // so carousels can refer to it. Held in state, not useRef: it's handed to
  // the gesture while rendering
  const [gestureRef] = useState<DrawerContextValue["gestureRef"]>(() => ({
    current: undefined,
  }));

  // How far the screen is slid aside: 0 = closed, 1 = open (by `width`)
  const progress = useSharedValue(0);
  // Where it's heading: decides at once whether the screen takes taps
  const headingOpen = useSharedValue(false);
  const dragging = useSharedValue(false);
  // Progress and finger position when the swipe took over
  const dragStart = useSharedValue(0);
  const grabX = useSharedValue(0);
  // Last end it arrived at (0 or 1), for the haptic
  const arrivedAt = useSharedValue(0);

  const settle = (open: boolean, velocity = 0) => {
    "worklet";
    headingOpen.set(open);
    progress.set(
      withSpring(open ? 1 : 0, { ...DrawerSpring, velocity }, (finished) => {
        // Not when a new swipe caught it on the way; that one settles it again
        if (finished) scheduleOnRN(setRestsOpen, open);
      }),
    );
  };

  const open = () => {
    Keyboard.dismiss();
    settle(true);
  };
  const close = () => settle(false);

  // Android's back button closes the menu first
  useEffect(() => {
    if (!restsOpen) return;
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        close();
        return true;
      },
    );
    return () => subscription.remove();
  });

  // Signing out unmounts the drawer, maybe mid-swipe: never leave presses blocked
  useEffect(() => () => setPressBlocked(false), []);

  // While a finger drags the drawer, the screens ignore its press
  useAnimatedReaction(
    () => dragging.get(),
    (now, before) => {
      if (before !== null && now !== before) {
        scheduleOnRN(setPressBlocked, now);
      }
    },
  );

  // A tick each time it arrives fully open or fully closed
  useAnimatedReaction(
    () => (progress.get() >= 0.99 ? 1 : progress.get() <= 0.01 ? 0 : null),
    (end) => {
      if (end !== null && end !== arrivedAt.get()) {
        arrivedAt.set(end);
        scheduleOnRN(playHaptic, HapticStyles.drawer);
      }
    },
  );

  const pan = Gesture.Pan()
    .withRef(gestureRef)
    .enabled(restsOpen || swipeEnabled)
    // Only towards where it can go: right to open, left to close. Everything
    // else (vertical scrolling, swiping a carousel left) is left alone
    .activeOffsetX(restsOpen ? -SWIPE_SLOP : SWIPE_SLOP)
    .failOffsetX(restsOpen ? SWIPE_SLOP : -SWIPE_SLOP)
    .failOffsetY([-SWIPE_SLOP, SWIPE_SLOP])
    .onStart((event) => {
      dragStart.set(progress.get());
      // Measured from here, so the screen doesn't jump by the slop
      grabX.set(event.translationX);
      dragging.set(true);
      scheduleOnRN(dismissKeyboard);
    })
    .onUpdate((event) => {
      const travelled = (event.translationX - grabX.get()) / width;
      progress.set(clamp(dragStart.get() + travelled, 0, 1));
    })
    .onEnd((event, success) => {
      // Interrupted (e.g. by an alert): back to the nearer end
      const velocity = success ? event.velocityX / width : 0;
      const coastsTo = progress.get() + velocity * FLING_PROJECTION;
      settle(coastsTo > 0.5, velocity);
    })
    .onFinalize(() => {
      dragging.set(false);
    });

  const screenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.get() * width }],
    borderRadius: progress.get() * OPEN_BORDER_RADIUS,
    borderColor: interpolateColor(
      progress.get(),
      [0, 1],
      ["transparent", theme.bg3],
    ),
  }));

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: progress.get() * OPEN_FADE_OPACITY,
  }));

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (progress.get() - 1) * width * MENU_PARALLAX }],
  }));

  // While it's open or opening, the visible strip of the screen only closes
  // the menu; otherwise touches go through to the screen
  const overlayProps = useAnimatedProps(() => ({
    pointerEvents: headingOpen.get() ? ("auto" as const) : ("none" as const),
  }));

  return (
    <DrawerContext value={{ open, close, gestureRef }}>
      <GestureDetector gesture={pan}>
        <View style={styles.root}>
          <Animated.View
            // Under the screen; only reachable (also for screen readers) once open
            accessibilityElementsHidden={!restsOpen}
            importantForAccessibility={
              restsOpen ? "auto" : "no-hide-descendants"
            }
            style={[styles.menu, { width }, menuStyle]}
          >
            {menu}
          </Animated.View>

          <Animated.View
            style={[styles.screen, { backgroundColor: theme.bg2 }, screenStyle]}
          >
            <View
              accessibilityElementsHidden={restsOpen}
              importantForAccessibility={
                restsOpen ? "no-hide-descendants" : "auto"
              }
              style={styles.fill}
            >
              {children}
            </View>
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: theme.bg2 },
                fadeStyle,
              ]}
            />
            <Animated.View
              animatedProps={overlayProps}
              style={StyleSheet.absoluteFill}
            >
              <Pressable
                accessible={restsOpen}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
                onPress={() => {
                  // Not at the end of a swipe that kept it open
                  if (!isPressBlocked()) close();
                }}
                style={styles.fill}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </GestureDetector>
    </DrawerContext>
  );
}

export type DrawerSwipeBlockerProps = {
  /** False where a swipe right has nothing to scroll back to, so it may open the menu */
  enabled?: boolean;
  /** The scroller */
  children: ReactElement;
};

/**
 * Wrap a sideways scroller (e.g. an image carousel) in this, so swiping it
 * scrolls it instead of opening the drawer
 */
export function DrawerSwipeBlocker({
  enabled = true,
  children,
}: DrawerSwipeBlockerProps) {
  const drawer = use(DrawerContext);
  const native = Gesture.Native();
  // Outside a drawer (e.g. in a modal) there's nothing to block
  if (drawer && enabled) native.blocksExternalGesture(drawer.gestureRef);

  return <GestureDetector gesture={native}>{children}</GestureDetector>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  screen: {
    flex: 1,
    overflow: "hidden",
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
