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

export type ThemedCheckItemProps = ThemedPressableProps & {
  checked: boolean;
  label: string;
  onPress?: () => void;
  sublabel?: string;
  bg?: ThemeColor;
  fgLabel?: ThemeColor;
  fgSublabel?: ThemeColor;
  /** Trailing controls, e.g. a DatePickerButton. Tapping them doesn't toggle the item */
  children?: ReactNode;
};

export function ThemedCheckItem({
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
}: ThemedCheckItemProps) {
  const theme = useTheme();

  return (
    <ThemedView
      themeColor={bg ?? "bg3"}
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
        <ThemedView
          themeColor={checked ? "acc1" : "fg2"}
          style={styles.outerCircle}
        >
          <ThemedView
            themeColor={checked ? "acc1" : (bg ?? "bg3")}
            style={{ ...styles.innerCircle, borderColor: theme[bg ?? "bg3"] }}
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
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  outerCircle: {
    height: 18,
    width: 18,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    height: 14,
    width: 14,
    borderRadius: Radius.md,
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
    paddingRight: Spacing.two,
  },
  check: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
});
