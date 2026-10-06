import { Spacing, type SpacingKey } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

export type SeparatorProps = {
  /** Space kept free at both ends of the line */
  padding?: SpacingKey;
  orientation?: "horizontal" | "vertical";
};

/** 1px line between items, inset by `padding` at both ends */
export function Separator({
  padding = "three",
  orientation = "horizontal",
}: SeparatorProps) {
  const theme = useTheme();
  const inset = Spacing[padding];

  return (
    <View
      style={[
        orientation === "horizontal"
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
    alignSelf: "stretch",
  },
});
