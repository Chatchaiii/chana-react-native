import { TextStyles } from "@/components/themed-text";
import {
  ThemedTextInput,
  type ThemedTextInputProps,
} from "@/components/themed-text-input";
import { Radius, Spacing, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

/** As tall as a medium_1 Button, so a field and its button line up */
export const TEXT_FIELD_HEIGHT =
  Spacing.three * 2 + TextStyles.label.lineHeight;
// Space around a trailing control, e.g. the welcome screen's arrow button
const TRAILING_INSET = Spacing.one;

export type TextFieldProps = ThemedTextInputProps & {
  /** Red outline, e.g. for a rejected password */
  invalid?: boolean;
  /** Control at the end of the field, e.g. a submit Button with radius "md" */
  trailing?: ReactNode;
  /** Field background; bg1 (card) by default */
  bg?: ThemeColor;
  /** Style of the field's box; `style` goes to the text input */
  containerStyle?: StyleProp<ViewStyle>;
};

/** Filled single-line input, optionally with a control at its end */
export function TextField({
  invalid = false,
  trailing,
  bg = "bg1",
  containerStyle,
  style,
  ...rest
}: TextFieldProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.field,
        trailing ? styles.withTrailing : null,
        {
          backgroundColor: theme[bg],
          borderColor: invalid ? theme.neg1 : "transparent",
        },
        containerStyle,
      ]}
    >
      <ThemedTextInput {...rest} style={[styles.input, style]} />
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: TEXT_FIELD_HEIGHT,
    // Concentric with a trailing control of Radius.md
    borderRadius: Radius.md + TRAILING_INSET,
    borderCurve: "continuous",
    borderWidth: 2,
  },
  withTrailing: {
    padding: TRAILING_INSET,
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
  },
});
