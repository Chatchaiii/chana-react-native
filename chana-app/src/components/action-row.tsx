import { ThemedIcon } from "@/components/themed-icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { IconName } from "@/constants/icons.generated";
import { Radius, Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

const ICON_SIZE = 18;
const ROW_PADDING = Spacing.two;
const ICON_BOX_PADDING = Spacing.two;
const GAP = Spacing.two;

/**
 * Where an ActionRow's label starts: pass it as a List's
 * `separatorInsetLeading`, so separators line up with the labels
 */
export const ActionRowSeparatorInset =
  ROW_PADDING + ICON_SIZE + ICON_BOX_PADDING * 2 + GAP;

export type ActionRowProps = Omit<ThemedPressableProps, "children"> & {
  icon: IconName;
  label: string;
  /** Red, for actions like delete */
  destructive?: boolean;
  /** Shows a chevron, for rows that open another page */
  chevron?: boolean;
};

/** Tappable row with an icon in a tinted box and a label, e.g. an option in a sheet */
export function ActionRow({
  icon,
  label,
  destructive = false,
  chevron = false,
  style,
  ...rest
}: ActionRowProps) {
  return (
    <ThemedPressable
      accessibilityLabel={label}
      {...rest}
      style={[styles.row, style]}
    >
      <ThemedView
        themeColor={destructive ? "neg2" : "bg3"}
        style={styles.iconBox}
      >
        <ThemedIcon
          icon={icon}
          size={ICON_SIZE}
          themeColor={destructive ? "neg1" : "fg2"}
        />
      </ThemedView>
      <ThemedText
        type="label"
        themeColor={destructive ? "neg1" : "fg1"}
        style={styles.label}
      >
        {label}
      </ThemedText>
      {chevron ? <ThemedIcon icon="chevron.right" themeColor="fg3" /> : null}
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: ROW_PADDING,
    gap: GAP,
  },
  iconBox: {
    padding: ICON_BOX_PADDING,
    borderRadius: Radius.xs,
    borderCurve: "continuous",
  },
  label: {
    flex: 1,
  },
});
