import { Icon } from "@/components/icon";
import type { IconName } from "@/constants/icons.generated";
import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export type ThemedIconProps = {
  /** Name of an icon in assets/icons */
  icon: IconName;
  themeColor?: ThemeColor;
  size?: number;
};

/** An app icon in a theme color */
export function ThemedIcon({
  icon,
  themeColor = "fg1",
  size = 18,
}: ThemedIconProps) {
  const theme = useTheme();

  return <Icon icon={icon} size={size} color={theme[themeColor]} />;
}
