import { ThemedIcon } from "@/components/themed-icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import {
  ButtonBorderRadii,
  Spacing,
  type ButtonShape,
  type ThemeColor,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { IconSvgElement } from "@hugeicons/react-native";
import { StyleSheet } from "react-native";

export type ButtonType = "default" | "primary" | "secondary" | "tertiary";
export type ButtonSize = "small" | "medium_1" | "medium_2" | "large";

export type ThemedButtonProps = Omit<ThemedPressableProps, "children"> & {
  icon?: IconSvgElement;
  label: string;
  type?: ButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  align?: "center" | "left";
  fullWidth?: boolean;
  bg?: ThemeColor;
  fg?: ThemeColor;
};

// Colors per type; the bg/fg props override these
const TypeColors: Record<ButtonType, { bg: ThemeColor; fg: ThemeColor }> = {
  default: { bg: "bg2", fg: "fg2" },
  primary: { bg: "fg1", fg: "bg1" },
  secondary: { bg: "bg2", fg: "fg1" },
  tertiary: { bg: "bg3", fg: "fg1" },
};

/** Styled button (colors, size, shape, icon + label) on top of ThemedPressable. */
export function ThemedButton({
  icon,
  label,
  type = "default",
  size = "medium_1",
  shape = "default",
  align = "center",
  fullWidth = false,
  bg,
  fg,
  style,
  ...rest
}: ThemedButtonProps) {
  const theme = useTheme();
  const colors = TypeColors[type];

  return (
    <ThemedPressable
      {...rest}
      style={[
        styles.base,
        sizeStyles[size],
        !fullWidth && styles.fit,
        align === "left" && styles.alignLeft,
        {
          borderRadius: ButtonBorderRadii[shape],
          backgroundColor: theme[bg ?? colors.bg],
        },
        style,
      ]}
    >
      {icon && <ThemedIcon icon={icon} themeColor={fg ?? colors.fg} />}
      <ThemedText
        themeColor={fg ?? colors.fg}
        type={size === "small" ? "sublabel" : "label"}
      >
        {label}
      </ThemedText>
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  fit: {
    alignSelf: "flex-start",
  },
  alignLeft: {
    justifyContent: "flex-start",
  },
});

const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  medium_1: {
    height: 42,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  medium_2: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  large: {
    flexDirection: "column",
    padding: Spacing.three,
    gap: Spacing.two,
  },
});
