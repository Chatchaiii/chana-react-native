import { Button, ButtonIconSizes } from "@/components/button";
import { TextField, type TextFieldProps } from "@/components/text-field";
import { Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

// The icon-only medium_1 arrow button is square: padding on both sides + icon
const BUTTON_SIZE = Spacing.three * 2 + ButtonIconSizes.medium_1;
// Keeps typed text off the button
const TEXT_GAP = Spacing.two;

export type SubmitFieldProps = Omit<
  TextFieldProps,
  "trailing" | "onSubmitEditing"
> & {
  onSubmit: () => void;
  /** Whether the input is complete, e.g. a valid email */
  canSubmit: boolean;
  /** While the submit runs: spinner in the button, no second submit */
  loading?: boolean;
  /** What the arrow button does, for screen readers */
  submitLabel: string;
};

/**
 * Gray field with centred text and an arrow button at its end, for a single
 * value that moves the sign-in flow on (email, password). Return submits too
 */
export function SubmitField({
  onSubmit,
  canSubmit,
  loading = false,
  submitLabel,
  style,
  ...rest
}: SubmitFieldProps) {
  const submit = () => {
    if (canSubmit && !loading) onSubmit();
  };

  return (
    <TextField
      bg="bg3"
      returnKeyType="go"
      {...rest}
      onSubmitEditing={submit}
      style={[styles.input, style]}
      trailing={
        <Button
          icon="arrow.right"
          type="prominent"
          size="medium_1"
          radius="md"
          loading={loading}
          disabled={!canSubmit || loading}
          accessibilityLabel={submitLabel}
          onPress={submit}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  // The button takes the right end, so the same width is kept free on the
  // left: the text then centres on the whole field, not just the space beside it
  input: {
    textAlign: "center",
    paddingLeft: BUTTON_SIZE + TEXT_GAP,
    paddingRight: TEXT_GAP,
  },
});
