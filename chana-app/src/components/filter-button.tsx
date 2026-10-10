import { ThemedIcon } from "@/components/themed-icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import type { IconName } from "@/constants/icons.generated";
import { Radius, Spacing, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HapticStyles } from "@/utils/haptics";
import { StyleSheet, View } from "react-native";

const TILE_ICON_SIZE = 22;

export type FilterButtonProps = Omit<ThemedPressableProps, "children"> & {
  label: string;
  /** How many items the filter shows */
  count: number;
  /** Whether this filter is applied */
  active: boolean;
  icon?: IconName;
  /**
   * tile: a Reminders-style smart list (icon and count on top, label below),
   * for the main filters. chip: a small pill with the count after the label
   */
  variant?: "tile" | "chip";
};

/** Selectable filter with the number of items it shows */
export function FilterButton({
  label,
  count,
  active,
  icon,
  variant = "tile",
  style,
  ...rest
}: FilterButtonProps) {
  const theme = useTheme();
  // Selected filters are inverted, like a primary Button
  const bg: ThemeColor = active ? "fg1" : "bg1";
  const fg: ThemeColor = active ? "bg1" : "fg1";
  // Secondary text: the tile's label, the chip's count
  const muted: ThemeColor = active ? "bg1" : "fg2";

  return (
    <ThemedPressable
      haptic={HapticStyles.select}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label}, ${count}`}
      {...rest}
      style={[
        variant === "tile" ? styles.tile : styles.chip,
        { backgroundColor: theme[bg] },
        style,
      ]}
    >
      {variant === "tile" ? (
        <>
          <View style={styles.tileTop}>
            {icon ? (
              <ThemedIcon icon={icon} themeColor={fg} size={TILE_ICON_SIZE} />
            ) : null}
            <ThemedText type="heading_3" themeColor={fg}>
              {count}
            </ThemedText>
          </View>
          <ThemedText type="label" themeColor={muted}>
            {label}
          </ThemedText>
        </>
      ) : (
        <>
          {icon ? <ThemedIcon icon={icon} themeColor={fg} /> : null}
          <ThemedText type="sublabel" themeColor={fg}>
            {label}
          </ThemedText>
          <ThemedText
            type="sublabel"
            themeColor={muted}
            style={active ? styles.dim : null}
          >
            {count}
          </ThemedText>
        </>
      )}
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  tileTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    borderCurve: "continuous",
  },
  // The count next to a selected chip's label, a step quieter
  dim: {
    opacity: 0.6,
  },
});
