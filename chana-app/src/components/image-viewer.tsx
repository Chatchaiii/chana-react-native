import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image, type ImageSource } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, useWindowDimensions, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

/** Window frame of the thumbnail the viewer expands from and collapses into */
export type ViewerOrigin = {
  x: number;
  y: number;
  width: number;
  height: number;
  borderRadius: number;
};

export type ImageViewerProps = {
  images: (string | ImageSource)[];
  /** Width / height of each image, used to size it on screen */
  aspectRatios: number[];
  /** Image shown first */
  initialIndex: number;
  origin: ViewerOrigin;
  /** Called while swiping, so the thumbnail can follow along */
  onIndexChange?: (index: number) => void;
  /** Called once the closing animation has finished */
  onClose: () => void;
};

// Short, eased timings: no bounce, and the modal is gone quickly after closing
const OPEN_TIMING = { duration: 280, easing: Easing.out(Easing.cubic) };
const CLOSE_TIMING = { duration: 240, easing: Easing.out(Easing.cubic) };
const SNAP_BACK_TIMING = { duration: 180, easing: Easing.out(Easing.cubic) };
// Vertical drag distance or speed that dismisses the viewer on release
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

/**
 * Full-screen image viewer that expands from its thumbnail like iOS Photos.
 * Swipe sideways to browse, swipe up or down to dismiss.
 */
export function ImageViewer({
  images,
  aspectRatios,
  initialIndex,
  origin,
  onIndexChange,
  onClose,
}: ImageViewerProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(initialIndex);

  // 0 = at the thumbnail, 1 = full screen
  const progress = useSharedValue(0);
  const dragY = useSharedValue(0);
  const closing = useSharedValue(false);

  useEffect(() => {
    progress.set(withTiming(1, OPEN_TIMING));
  }, [progress]);

  const dismiss = () => {
    "worklet";
    if (closing.get()) return;
    closing.set(true);
    dragY.set(withTiming(0, CLOSE_TIMING));
    // Always hand control back, even if the animation gets interrupted
    progress.set(withTiming(0, CLOSE_TIMING, () => scheduleOnRN(onClose)));
  };

  // Vertical drags move the image; horizontal ones are left to the pager
  const pan = Gesture.Pan()
    .activeOffsetY([-12, 12])
    .failOffsetX([-12, 12])
    .onUpdate((event) => {
      dragY.set(event.translationY);
    })
    .onEnd((event) => {
      if (
        Math.abs(event.translationY) > DISMISS_DISTANCE ||
        Math.abs(event.velocityY) > DISMISS_VELOCITY
      ) {
        dismiss();
      } else {
        dragY.set(withTiming(0, SNAP_BACK_TIMING));
      }
    });

  // Backdrop and controls fade in with the expansion and out while dragging
  const fadeStyle = useAnimatedStyle(() => ({
    opacity:
      progress.get() *
      interpolate(Math.abs(dragY.get()), [0, 300], [1, 0], "clamp"),
  }));

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={dismiss}
    >
      <GestureHandlerRootView style={styles.fill}>
        <StatusBar style="light" />
        <Animated.View style={[styles.backdrop, fadeStyle]} />

        <GestureDetector gesture={pan}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            contentOffset={{ x: initialIndex * width, y: 0 }}
            onScroll={(event) => {
              const next = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              if (next !== index) {
                setIndex(next);
                onIndexChange?.(next);
              }
            }}
          >
            {images.map((source, i) => (
              <ViewerPage
                key={i}
                source={source}
                aspectRatio={aspectRatios[i] ?? 1}
                isCurrent={i === index}
                origin={origin}
                progress={progress}
                dragY={dragY}
              />
            ))}
          </ScrollView>
        </GestureDetector>

        <Animated.View
          style={[styles.header, { top: insets.top + Spacing.two }, fadeStyle]}
        >
          {images.length > 1 && (
            <ThemedText type="label" style={styles.counter}>
              {index + 1}/{images.length}
            </ThemedText>
          )}
          <ThemedPressable
            onPress={dismiss}
            hitSlop={8}
            accessibilityLabel="Close"
            style={styles.close}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#ffffff" />
          </ThemedPressable>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

type ViewerPageProps = {
  source: string | ImageSource;
  aspectRatio: number;
  /** Only the current page animates between thumbnail and full screen */
  isCurrent: boolean;
  origin: ViewerOrigin;
  progress: SharedValue<number>;
  dragY: SharedValue<number>;
};

function ViewerPage({
  source,
  aspectRatio,
  isCurrent,
  origin,
  progress,
  dragY,
}: ViewerPageProps) {
  const { width, height } = useWindowDimensions();
  const target = fitRect(aspectRatio, width, height);

  const animatedStyle = useAnimatedStyle(() => {
    if (!isCurrent) {
      return {
        left: target.x,
        top: target.y,
        width: target.width,
        height: target.height,
        borderRadius: 0,
        transform: [{ translateY: 0 }, { scale: 1 }],
      };
    }

    // Morph the frame from the thumbnail to the fitted full-screen rect
    const p = progress.get();
    return {
      left: interpolate(p, [0, 1], [origin.x, target.x]),
      top: interpolate(p, [0, 1], [origin.y, target.y]),
      width: interpolate(p, [0, 1], [origin.width, target.width]),
      height: interpolate(p, [0, 1], [origin.height, target.height]),
      borderRadius: interpolate(p, [0, 1], [origin.borderRadius, 0], "clamp"),
      // Follow the finger vertically and shrink slightly while dragging
      transform: [
        { translateY: dragY.get() },
        {
          scale: interpolate(
            Math.abs(dragY.get()),
            [0, height],
            [1, 0.9],
            "clamp",
          ),
        },
      ],
    };
  });

  return (
    <View style={{ width, height }}>
      <Animated.View style={[styles.image, animatedStyle]}>
        {/* "cover" in a frame of the image's own ratio shows the whole image */}
        <Image
          source={source}
          contentFit="cover"
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

/** Largest rect with the given ratio that fits the screen, centered */
function fitRect(
  aspectRatio: number,
  screenWidth: number,
  screenHeight: number,
) {
  let width = screenWidth;
  let height = screenWidth / aspectRatio;
  if (height > screenHeight) {
    height = screenHeight;
    width = screenHeight * aspectRatio;
  }
  return {
    x: (screenWidth - width) / 2,
    y: (screenHeight - height) / 2,
    width,
    height,
  };
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#000000",
  },
  image: {
    position: "absolute",
    overflow: "hidden",
    borderCurve: "continuous",
  },
  header: {
    position: "absolute",
    left: Spacing.three,
    right: Spacing.three,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    color: "#ffffff",
  },
  close: {
    position: "absolute",
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
});
