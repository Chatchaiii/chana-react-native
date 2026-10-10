import { Icon } from "@/components/ui/icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/ui/themed-pressable";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import type { IconName } from "@/constants/icons.generated";
import { Radius, Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

const ICON_SIZE = 18;
const ROW_PADDING = Spacing.two;
const ICON_BOX_PADDING = Spacing.two;
const GAP = Spacing.two;

/**
 * Where an ActionItem's label starts: pass it as a List's
 * `separatorInsetLeading`, so separators line up with the labels
 */
export const ActionItemSeparatorInset =
  ROW_PADDING + ICON_SIZE + ICON_BOX_PADDING * 2 + GAP;

export type ActionItemProps = Omit<ThemedPressableProps, "children"> & {
  icon: IconName;
  label: string;
  /** Red, for actions like delete */
  destructive?: boolean;
  /** Shows a chevron, for rows that open another page */
  chevron?: boolean;
};

/** Tappable row with an icon in a tinted box and a label, e.g. an option in a sheet */
export function ActionItem({
  icon,
  label,
  destructive = false,
  chevron = false,
  style,
  ...rest
}: ActionItemProps) {
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
        <Icon
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
      {chevron ? <Icon icon="chevron.right" themeColor="fg3" /> : null}
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
