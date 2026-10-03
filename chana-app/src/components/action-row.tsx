import { ThemedIcon } from "@/components/themed-icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import type { IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet } from "react-native";

export type ActionRowProps = Omit<ThemedPressableProps, "children"> & {
  icon: IconSvgElement;
  label: string;
  /** Red, for actions like delete */
  destructive?: boolean;
};

/** Tappable row with an icon and a label, e.g. one option in a sheet */
export function ActionRow({
  icon,
  label,
  destructive = false,
  style,
  ...rest
}: ActionRowProps) {
  const color = destructive ? "neg1" : "fg1";

  return (
    <ThemedPressable
      accessibilityLabel={label}
      {...rest}
      style={[styles.row, style]}
    >
      <ThemedIcon icon={icon} themeColor={color} />
      <ThemedText type="label" themeColor={color}>
        {label}
      </ThemedText>
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
