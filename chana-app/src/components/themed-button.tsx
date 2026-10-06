import { ThemedIcon } from "@/components/themed-icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import type { IconName } from "@/constants/icons.generated";
import {
  Radius,
  Spacing,
  type RadiusKey,
  type ThemeColor,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

export type ButtonType =
  "default" | "prominent" | "primary" | "secondary" | "tertiary";
export type ButtonSize = keyof typeof sizeStyles;

export type ThemedButtonProps = Omit<ThemedPressableProps, "children"> & {
  icon?: IconName;
  label: string;
  sublabel?: string;
  type?: ButtonType;
  size?: ButtonSize;
  radius?: RadiusKey;
  align?: "center" | "left";
  fullWidth?: boolean;
  bg?: ThemeColor;
  fg?: ThemeColor;
};

// Colors per type; the bg/fg props override these
const TypeColors: Record<ButtonType, { bg: ThemeColor; fg: ThemeColor }> = {
  default: { bg: "bg2", fg: "fg2" },
  prominent: { bg: "acc1", fg: "constWhite" },
  primary: { bg: "fg1", fg: "bg1" },
  secondary: { bg: "bg2", fg: "fg1" },
  tertiary: { bg: "bg3", fg: "fg1" },
};

/** Styled button (colors, size, radius, icon + label) on top of ThemedPressable */
export function ThemedButton({
  icon,
  label,
  sublabel,
  type = "default",
  size = "medium_1",
  radius = "sm",
  align = "center",
  fullWidth = false,
  bg,
  fg,
  style,
  ...rest
}: ThemedButtonProps) {
  const theme = useTheme();
  const colors = TypeColors[type];
  const foreground = fg ?? colors.fg;

  return (
    <ThemedPressable
      {...rest}
      style={[
        styles.base,
        sizeStyles[size],
        !fullWidth && styles.fit,
        align === "left" && styles.alignLeft,
        {
          borderRadius: Radius[radius],
          backgroundColor: theme[bg ?? colors.bg],
        },
        style,
      ]}
    >
      {icon && <ThemedIcon icon={icon} themeColor={foreground} />}
      <View>
        <ThemedText
          type={size === "small" ? "sublabel" : "label"}
          themeColor={foreground}
        >
          {label}
        </ThemedText>
        {sublabel && size !== "small" && (
          <ThemedText type="sublabel" themeColor={foreground}>
            {sublabel}
          </ThemedText>
        )}
      </View>
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
    padding: Spacing.three,
    gap: Spacing.three,
  },
  medium_2: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  large: {
    flexDirection: "column",
    padding: Spacing.two,
    gap: Spacing.two,
  },
});
