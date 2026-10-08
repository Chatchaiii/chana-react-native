import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Radius, Spacing, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

const CIRCLE_SIZE = 18;
// The inner dot's border shows the background, leaving a ring around the dot
const DOT_SIZE = 14;

export type CheckItemProps = Omit<
  ThemedPressableProps,
  "children" | "onPress"
> & {
  checked: boolean;
  onPress?: () => void;
  label: string;
  sublabel?: string;
  bg?: ThemeColor;
  fgLabel?: ThemeColor;
  fgSublabel?: ThemeColor;
  /** Trailing controls, e.g. a date Button. Tapping them doesn't toggle the item */
  children?: ReactNode;
};

/** Row with a radio-style check, label and sublabel; tapping it toggles `checked` */
export function CheckItem({
  checked,
  onPress,
  label,
  sublabel,
  bg,
  fgLabel,
  fgSublabel,
  children,
  style,
  ...rest
}: CheckItemProps) {
  const theme = useTheme();
  const background = bg ?? "bg1";

  return (
    <ThemedView
      themeColor={background}
      style={[styles.row, children ? styles.withTrailing : null, style]}
    >
      <ThemedPressable
        {...rest}
        onPress={onPress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled: !!rest.disabled }}
        accessibilityLabel={label}
        style={styles.check}
      >
        <ThemedView themeColor={checked ? "acc1" : "fg2"} style={styles.circle}>
          <ThemedView
            themeColor={checked ? "acc1" : background}
            style={[styles.dot, { borderColor: theme[background] }]}
          />
        </ThemedView>
        <View style={styles.text}>
          <ThemedText type="label" themeColor={fgLabel ?? "fg1"}>
            {label}
          </ThemedText>
          {sublabel ? (
            <ThemedText type="sublabel" themeColor={fgSublabel ?? "fg2"}>
              {sublabel}
            </ThemedText>
          ) : null}
        </View>
      </ThemedPressable>
      {/* Wrapped, so a child's own alignSelf (e.g. Button's) can't pull it off center */}
      {children ? <View>{children}</View> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: DOT_SIZE,
    width: DOT_SIZE,
    borderRadius: Radius.full,
    borderWidth: Spacing.half,
  },
  text: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
  },
  withTrailing: {
    paddingRight: Spacing.three,
  },
  check: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
  },
});
