import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

export type SeparatorProps = {
  /**
   * Space kept free before / after the line, in points. Default: 16 at both
   * ends of a horizontal line, none for a vertical one (it sits in a short row)
   */
  insetLeading?: number;
  insetTrailing?: number;
  /** A vertical line between items in a row (e.g. a horizontal List) */
  vertical?: boolean;
};

/** 1px line between items, inset at its start and end */
export function Separator({
  insetLeading,
  insetTrailing,
  vertical = false,
}: SeparatorProps) {
  const theme = useTheme();
  const defaultInset = vertical ? 0 : Spacing.three;
  const leading = insetLeading ?? defaultInset;
  const trailing = insetTrailing ?? defaultInset;

  return (
    <View
      style={[
        vertical
          ? [styles.vertical, { marginTop: leading, marginBottom: trailing }]
          : [styles.horizontal, { marginLeft: leading, marginRight: trailing }],
        { backgroundColor: theme.bg3 },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
  },
  vertical: {
    width: 1,
    // Takes the height of the row it's in
    alignSelf: "stretch",
  },
});
