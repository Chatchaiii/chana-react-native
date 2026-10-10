import { ThemedPressable } from "@/components/ui/themed-pressable";
import { ThemedText } from "@/components/ui/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HapticStyles } from "@/utils/haptics";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export type SegmentedControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

/** A row of equal segments to switch between a few views; one is selected */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.track, { backgroundColor: theme.bg3 }, style]}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <ThemedPressable
            key={option.value}
            onPress={() => onChange(option.value)}
            haptic={HapticStyles.select}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && { backgroundColor: theme.bg1 }]}
          >
            <ThemedText type="sublabel" themeColor={selected ? "fg1" : "fg2"}>
              {option.label}
            </ThemedText>
          </ThemedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: Spacing.half,
    borderRadius: Radius.full,
  },
  segment: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
  },
});
