import { ImageViewer, type ViewerOrigin } from "@/components/image-viewer";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { Image, type ImageSource } from "expo-image";
import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export type ImageCarouselProps = {
  images: (string | ImageSource)[];
  /** Width / height of each image, e.g. 1 for square, 4 / 5 for portrait */
  aspectRatio?: number;
  style?: StyleProp<ViewStyle>;
};

const BORDER_RADIUS = 24;
const DOT_SIZE = 6;
const ACTIVE_DOT_WIDTH = 16;

/**
 * Swipeable image pager with a "1/4" counter and page dots. Tapping an image
 * opens it full screen.
 */
export function ImageCarousel({
  images,
  aspectRatio = 4 / 5,
  style,
}: ImageCarouselProps) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  // Natural width / height of each loaded image, for the full-screen frame
  const [imageRatios, setImageRatios] = useState<Record<number, number>>({});
  // Set while the full-screen viewer is open
  const [origin, setOrigin] = useState<ViewerOrigin | null>(null);
  const containerRef = useRef<View>(null);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.set(event.contentOffset.x);
  });

  // Update the counter once the page under the center changes
  useAnimatedReaction(
    () => (width > 0 ? Math.round(scrollX.get() / width) : 0),
    (current, previous) => {
      if (current !== previous) scheduleOnRN(setIndex, current);
    },
    [width],
  );

  const showIndicators = images.length > 1;

  const openViewer = () => {
    // The viewer expands from wherever the carousel is on screen right now
    containerRef.current?.measureInWindow((x, y, frameWidth, frameHeight) => {
      setOrigin({
        x,
        y,
        width: frameWidth,
        height: frameHeight,
        borderRadius: BORDER_RADIUS,
      });
    });
  };

  return (
    <View
      ref={containerRef}
      // Hidden while open, so only the viewer's flying copy is visible
      style={[styles.container, style, origin && styles.hidden]}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {images.map((source, i) => (
          <Pressable
            key={i}
            onPress={openViewer}
            accessibilityRole="imagebutton"
            accessibilityLabel={`Open image ${i + 1} of ${images.length}`}
          >
            <Image
              source={source}
              contentFit="cover"
              transition={200}
              onLoad={(event) => {
                const ratio = event.source.width / event.source.height;
                setImageRatios((ratios) =>
                  ratios[i] === ratio ? ratios : { ...ratios, [i]: ratio },
                );
              }}
              style={{ width, height: width / aspectRatio }}
            />
          </Pressable>
        ))}
      </Animated.ScrollView>

      {showIndicators && (
        <>
          <View style={styles.counter}>
            <ThemedText type="sublabel" style={styles.overlayText}>
              {index + 1}/{images.length}
            </ThemedText>
          </View>

          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <Dot key={i} index={i} scrollX={scrollX} pageWidth={width} />
            ))}
          </View>
        </>
      )}

      {origin && (
        <ImageViewer
          images={images}
          aspectRatios={images.map((_, i) => imageRatios[i] ?? aspectRatio)}
          initialIndex={index}
          origin={origin}
          // Keep the carousel on the same image, so closing lands on it
          onIndexChange={(next) =>
            scrollRef.current?.scrollTo({ x: next * width, animated: false })
          }
          onClose={() => setOrigin(null)}
        />
      )}
    </View>
  );
}

type DotProps = {
  index: number;
  scrollX: SharedValue<number>;
  pageWidth: number;
};

/** Stretches into a pill while its page is in view, following the swipe */
function Dot({ index, scrollX, pageWidth }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const page = pageWidth > 0 ? scrollX.get() / pageWidth : 0;
    const distance = Math.min(Math.abs(page - index), 1);

    return {
      width: interpolate(distance, [0, 1], [ACTIVE_DOT_WIDTH, DOT_SIZE]),
      opacity: interpolate(distance, [0, 1], [1, 0.5]),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

// Overlays sit on top of photos, so they use fixed colors instead of the theme
const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS,
    borderCurve: "continuous",
    overflow: "hidden",
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  counter: {
    position: "absolute",
    top: Spacing.three,
    right: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  hidden: {
    opacity: 0,
  },
  overlayText: {
    color: "#ffffff",
  },
  dots: {
    position: "absolute",
    bottom: Spacing.three,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.one,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#ffffff",
  },
});
