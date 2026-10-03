import { Spacing, type Spacings } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

export type Orientation = "horizontal" | "vertical";

export type SeparatorProps = {
  /** Space kept free at both ends of the line */
  padding?: Spacings;
  orientation?: Orientation;
};

export function Separator({
  padding = "three",
  orientation = "horizontal",
}: SeparatorProps) {
  const theme = useTheme();
  const horizontal = orientation === "horizontal";

  return (
    <View
      style={[
        horizontal
          ? [styles.horizontal, { marginHorizontal: Spacing[padding] }]
          : [styles.vertical, { marginVertical: Spacing[padding] }],
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
