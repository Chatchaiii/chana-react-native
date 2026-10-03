import { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react-native";
import { type TextProps } from "react-native";

export type ThemedIconProps = {
  icon: IconSvgElement;
  themeColor?: ThemeColor;
  size?: number;
  strokeWidth?: number;
};

export function ThemedIcon({
  icon,
  themeColor,
  size = 18,
  strokeWidth = 3,
}: ThemedIconProps & TextProps) {
  const theme = useTheme();

  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={theme[themeColor ?? "fg1"]}
      strokeWidth={strokeWidth}
    />
  );
}
