import { Icon } from "@/components/ui/icon";
import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/ui/themed-pressable";
import { TextStyles, ThemedText } from "@/components/ui/themed-text";
import type { IconName } from "@/constants/icons.generated";
import {
  Radius,
  Spacing,
  type RadiusKey,
  type ThemeColor,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export type ButtonType =
  "default" | "prominent" | "primary" | "secondary" | "tertiary";
export type ButtonSize = keyof typeof sizeStyles;

export type ButtonProps = Omit<ThemedPressableProps, "children"> & {
  icon?: IconName;
  /** Optional for icon-only buttons, which then need an accessibilityLabel */
  label?: string;
  sublabel?: string;
  /** Shows a spinner instead of the icon and label, e.g. while a request runs */
  loading?: boolean;
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
  // Page color: only stands out on a card
  default: { bg: "bg2", fg: "fg1" },
  // Accent, for the main action of a screen
  prominent: { bg: "acc1", fg: "constWhite" },
  // Inverted (black in light mode, white in dark), e.g. confirming in a sheet
  primary: { bg: "fg1", fg: "bg1" },
  // Card color, raised on the page
  secondary: { bg: "bg1", fg: "fg1" },
  // Fill, for controls inside a card
  tertiary: { bg: "bg3", fg: "fg1" },
};

/** Styled button (colors, size, radius, icon + label) on top of ThemedPressable */
export function Button({
  icon,
  label,
  sublabel,
  loading = false,
  type = "default",
  size = "medium_1",
  radius = "sm",
  align = "center",
  fullWidth = false,
  bg,
  fg,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const colors = TypeColors[type];
  const foreground = fg ?? colors.fg;
  const labelType = size === "small" ? "sublabel" : "label";
  // The label's line when there is one, the icon otherwise
  const loadingSize = label
    ? TextStyles[labelType].lineHeight
    : ButtonIconSizes[size];

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
      {/* While loading, a spinner takes the place of the icon and label */}
      {loading ? (
        // In a box as big as what it replaces, so the button keeps its size
        <View
          style={[styles.spinner, { width: loadingSize, height: loadingSize }]}
        >
          <ActivityIndicator color={theme[foreground]} />
        </View>
      ) : icon ? (
        <Icon
          icon={icon}
          themeColor={foreground}
          size={ButtonIconSizes[size]}
        />
      ) : null}
      {/* Ternaries, not &&: an empty string outside <Text> would crash */}
      {!loading && (label || sublabel) ? (
        <View>
          {label ? (
            <ThemedText type={labelType} themeColor={foreground}>
              {label}
            </ThemedText>
          ) : null}
          {sublabel && size !== "small" ? (
            <ThemedText type="sublabel" themeColor={foreground}>
              {sublabel}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
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
  spinner: {
    alignItems: "center",
    justifyContent: "center",
  },
  alignLeft: {
    justifyContent: "flex-start",
  },
});

// Large buttons stack the icon above the label, so it can be bigger
export const ButtonIconSizes: Record<ButtonSize, number> = {
  small: 18,
  medium_1: 18,
  medium_2: 18,
  large: 24,
};

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
