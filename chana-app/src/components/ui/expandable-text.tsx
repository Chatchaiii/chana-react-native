import { ThemedPressable } from "@/components/ui/themed-pressable";
import { ThemedText } from "@/components/ui/themed-text";
import { Timings } from "@/constants/motion";
import { Spacing } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const COLLAPSED_LINES = 3;

export type ExpandableTextProps = {
  title: string;
  text: string;
  /** Truncate to three lines with "View more"; false shows the full text */
  collapsible?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Title and text, truncated to three lines with "View more" */
export function ExpandableText({
  title,
  text,
  collapsible = true,
  style,
}: ExpandableTextProps) {
  if (!collapsible) {
    return (
      <View style={[styles.container, style]}>
        <ThemedText type="heading_4">{title}</ThemedText>
        <ThemedText type="subtext" themeColor="fg2">
          {text}
        </ThemedText>
      </View>
    );
  }

  return <CollapsibleText title={title} text={text} style={style} />;
}

function CollapsibleText({
  title,
  text,
  style,
}: Omit<ExpandableTextProps, "collapsible">) {
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
      progress.set(
        withTiming(0, Timings.normal, () => scheduleOnRN(setClamped, true)),
      );
    } else {
      // Show the full text, then grow the box to reveal it
      setClamped(false);
      setExpanded(true);
      progress.set(withTiming(1, Timings.normal));
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View>
        <ThemedText type="heading_4">{title}</ThemedText>

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
              {text}
            </ThemedText>
            <ThemedText
              type="subtext"
              onLayout={(event) =>
                setFullHeight(event.nativeEvent.layout.height)
              }
            >
              {text}
            </ThemedText>
          </View>

          <Animated.View style={[styles.clip, heightStyle]}>
            <ThemedText
              type="subtext"
              themeColor="fg2"
              numberOfLines={clamped ? COLLAPSED_LINES : undefined}
            >
              {text}
            </ThemedText>
          </Animated.View>
        </View>
      </View>

      {truncated ? (
        <ThemedPressable onPress={toggle} hitSlop={8} style={styles.toggle}>
          <ThemedText type="sublabel" themeColor="fg2">
            {expanded ? "View less" : "View more"}
          </ThemedText>
        </ThemedPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
