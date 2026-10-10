import { TextStyles } from "@/components/themed-text";
import {
  ThemedTextInput,
  type ThemedTextInputProps,
} from "@/components/themed-text-input";
import { Radius, Spacing, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

/** Height of a field without controls in it */
export const TEXT_FIELD_HEIGHT = Spacing.three * 2 + TextStyles.label.fontSize;
const BORDER_WIDTH = 2;
// Space between the field's edge and a control inside it
const SLOT_INSET = Spacing.one;

export type TextFieldProps = ThemedTextInputProps & {
  /** Red outline, e.g. for a rejected password */
  invalid?: boolean;
  /** Control inside the field before the text */
  leading?: ReactNode;
  /** Control inside the field after the text, e.g. a submit Button with radius "md" */
  trailing?: ReactNode;
  /** Field background; bg1 (card) by default */
  bg?: ThemeColor;
  /** Style of the field's box; `style` goes to the text input */
  containerStyle?: StyleProp<ViewStyle>;
};

/** Filled single-line input, optionally with controls at its ends */
export function TextField({
  invalid = false,
  leading,
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
        leading || trailing ? styles.withControls : null,
        {
          backgroundColor: theme[bg],
          borderColor: invalid ? theme.neg1 : "transparent",
        },
        containerStyle,
      ]}
    >
      {leading}
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
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BORDER_WIDTH,
  },
  // A pill around its controls; the border is part of the inset
  withControls: {
    padding: SLOT_INSET - BORDER_WIDTH,
    borderRadius: Radius.lg,
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
  },
});
