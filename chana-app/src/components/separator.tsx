import { Spacing, type SpacingKey } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

export type SeparatorProps = {
  /**
   * Space kept free at both ends of the line. Defaults to "three" for
   * horizontal lines and none for vertical ones, which sit in short rows.
   */
  padding?: SpacingKey;
  /** A vertical line between items in a row (e.g. a horizontal List) */
  vertical?: boolean;
};

/** 1px line between items, inset by `padding` at both ends */
export function Separator({ padding, vertical = false }: SeparatorProps) {
  const theme = useTheme();
  const inset = padding ? Spacing[padding] : vertical ? 0 : Spacing.three;

  return (
    <View
      style={[
        vertical
          ? [styles.vertical, { marginVertical: inset }]
          : [styles.horizontal, { marginHorizontal: inset }],
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
