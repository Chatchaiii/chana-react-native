import { Spacing, type SpacingKey } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

export type SeparatorProps = {
  /**
   * Space kept free at both ends of the line. Defaults to "three" for
   * horizontal lines and none for vertical ones, which sit in short rows.
   */
  padding?: SpacingKey;
  orientation?: "horizontal" | "vertical";
};

/** 1px line between items, inset by `padding` at both ends */
export function Separator({
  padding,
  orientation = "horizontal",
}: SeparatorProps) {
  const theme = useTheme();
  const horizontal = orientation === "horizontal";
  const inset = padding ? Spacing[padding] : horizontal ? Spacing.three : 0;

  return (
    <View
      style={[
        horizontal
          ? [styles.horizontal, { marginHorizontal: inset }]
          : [styles.vertical, { marginVertical: inset }],
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
