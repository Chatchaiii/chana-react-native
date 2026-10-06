import { ContainerSizes, type ContainerSize } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
// Slower than UI transitions on purpose: the fill is the point of the chart
const FILL_TIMING = { duration: 1000, easing: Easing.out(Easing.cubic) };

const StrokeWidths = {
  s: 8,
  m: 12,
  l: 16,
} as const;
export type StrokeWidthKey = keyof typeof StrokeWidths;

export type RingChartProps = ViewProps & {
  /** Filled amount, out of `total` */
  portion: number;
  total: number;
  /** Where the fill starts, out of `total` (0 = top) */
  startPortion?: number;
  size?: ContainerSize;
  strokeWidth?: StrokeWidthKey;
};

/** Ring that fills clockwise to `portion / total`, animating on change */
export function RingChart({
  portion,
  total,
  startPortion = 0,
  size = "m",
  strokeWidth = "s",
  style,
  ...rest
}: RingChartProps) {
  const theme = useTheme();
  const stroke = StrokeWidths[strokeWidth];
  const diameter = ContainerSizes[size];
  const center = diameter / 2;
  // Inset by half the stroke so the ring isn't clipped at the edges
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const fraction = toFraction(portion, total);
  // SVG circles start at 3 o'clock; -90° moves the start to 12 o'clock
  const startAngle = -90 + toFraction(startPortion, total) * 360;

  const progress = useSharedValue(0);

  useEffect(() => {
    // Animates from the current fill, so updates don't restart from empty
    progress.set(withTiming(fraction, FILL_TIMING));
  }, [progress, fraction]);

  const fillProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.get()),
  }));

  return (
    <View
      {...rest}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: portion }}
      style={[styles.centered, style]}
    >
      <Svg width={diameter} height={diameter}>
        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.bg3}
          strokeWidth={stroke}
          fill="none"
        />
        {/* Fill */}
        {fraction > 0 ? (
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.acc1}
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(${startAngle} ${center} ${center})`}
            animatedProps={fillProps}
          />
        ) : null}
      </Svg>
    </View>
  );
}

/** `value / total`, clamped to 0–1 (0 when there's no total) */
function toFraction(value: number, total: number) {
  return total > 0 ? Math.min(Math.max(value / total, 0), 1) : 0;
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});
