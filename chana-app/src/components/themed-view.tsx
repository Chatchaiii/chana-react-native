import { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = {
  themeColor?: ThemeColor;
};

export function ThemedView({
  style,
  themeColor,
  ...otherProps
}: ThemedViewProps & ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[{ backgroundColor: theme[themeColor ?? "bg2"] }, style]}
      {...otherProps}
    />
  );
}
