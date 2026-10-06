import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  themeColor?: ThemeColor;
};

/** View with a theme background color */
export function ThemedView({
  themeColor = "bg2",
  style,
  ...rest
}: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View style={[{ backgroundColor: theme[themeColor] }, style]} {...rest} />
  );
}
