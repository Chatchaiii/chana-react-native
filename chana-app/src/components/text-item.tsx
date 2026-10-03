import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const TEXT =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

const COLLAPSED_LINES = 3;
const TIMING = { duration: 250, easing: Easing.out(Easing.cubic) };

/** Author name and post text, truncated to three lines with "View more". */
export function TextItem() {
  const [expanded, setExpanded] = useState(false);
  // Whether the visible text is cut to COLLAPSED_LINES (with an ellipsis)
  const [clamped, setClamped] = useState(true);
  const [collapsedHeight, setCollapsedHeight] = useState(0);
  const [fullHeight, setFullHeight] = useState(0);
  // 0 = collapsed, 1 = expanded
  const progress = useSharedValue(0);

  const measured = collapsedHeight > 0 && fullHeight > 0;
  const truncated = fullHeight > collapsedHeight + 1;

  const heightStyle = useAnimatedStyle(() =>
    measured
      ? {
          height: interpolate(
            progress.get(),
            [0, 1],
            [collapsedHeight, fullHeight],
          ),
        }
      : {},
  );

  const toggle = () => {
    if (expanded) {
      // Shrink first, then cut the text so the ellipsis comes back
      setExpanded(false);
      progress.set(withTiming(0, TIMING, () => scheduleOnRN(setClamped, true)));
    } else {
      // Show the full text, then grow the box to reveal it
      setClamped(false);
      setExpanded(true);
      progress.set(withTiming(1, TIMING));
    }
  };

  return (
    <View style={styles.item_wrapper}>
      <View>
        <ThemedText type="heading_4">chadchai</ThemedText>

        <View>
          {/* Invisible copies that measure both heights at the current width */}
          <View
            style={styles.measure}
            pointerEvents="none"
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden
          >
            <ThemedText
              type="subtext"
              numberOfLines={COLLAPSED_LINES}
              onLayout={(event) =>
                setCollapsedHeight(event.nativeEvent.layout.height)
              }
            >
              {TEXT}
            </ThemedText>
            <ThemedText
              type="subtext"
              onLayout={(event) =>
                setFullHeight(event.nativeEvent.layout.height)
              }
            >
              {TEXT}
            </ThemedText>
          </View>

          <Animated.View style={[styles.clip, heightStyle]}>
            <ThemedText
              type="subtext"
              themeColor="fg2"
              numberOfLines={clamped ? COLLAPSED_LINES : undefined}
            >
              {TEXT}
            </ThemedText>
          </Animated.View>
        </View>
      </View>

      {truncated && (
        <ThemedPressable onPress={toggle} hitSlop={8} style={styles.toggle}>
          <ThemedText type="sublabel" themeColor="fg2">
            {expanded ? "View less" : "View more"}
          </ThemedText>
        </ThemedPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item_wrapper: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.one,
  },
  measure: {
    position: "absolute",
    left: 0,
    right: 0,
    opacity: 0,
  },
  clip: {
    overflow: "hidden",
  },
  toggle: {
    alignSelf: "flex-start",
  },
});
