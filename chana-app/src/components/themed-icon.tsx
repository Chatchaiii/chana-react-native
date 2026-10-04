import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native";

export type ThemedIconProps = {
  icon: IconSvgElement;
  themeColor?: ThemeColor;
  size?: number;
  strokeWidth?: number;
  /** Fills the icon's shape in this color, e.g. a solid star */
  fill?: ThemeColor;
};

export function ThemedIcon({
  icon,
  themeColor = "fg1",
  size = 18,
  strokeWidth = 3,
  fill,
}: ThemedIconProps) {
  const theme = useTheme();

  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      color={theme[themeColor]}
      strokeWidth={strokeWidth}
      fill={fill ? theme[fill] : "none"}
    />
  );
}
