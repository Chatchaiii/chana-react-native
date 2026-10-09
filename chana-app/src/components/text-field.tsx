import { TextStyles } from "@/components/themed-text";
import {
  ThemedTextInput,
  type ThemedTextInputProps,
} from "@/components/themed-text-input";
import { Radius, Spacing, type ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

/** As tall as a medium_1 Button, so a field and its button line up */
export const TEXT_FIELD_HEIGHT =
  Spacing.three * 2 + TextStyles.label.lineHeight;

export type TextFieldProps = ThemedTextInputProps & {
  /** Red outline, e.g. for a rejected password */
  invalid?: boolean;
  /** Field background; bg1 (card) by default */
  bg?: ThemeColor;
  /** Style of the field's box; `style` goes to the text input */
  containerStyle?: StyleProp<ViewStyle>;
};

/** Filled single-line input */
export function TextField({
  invalid = false,
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
        {
          backgroundColor: theme[bg],
          borderColor: invalid ? theme.neg1 : "transparent",
        },
        containerStyle,
      ]}
    >
      <ThemedTextInput {...rest} style={[styles.input, style]} />
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
    borderWidth: 2,
  },
  input: {
    flex: 1,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
  },
});
