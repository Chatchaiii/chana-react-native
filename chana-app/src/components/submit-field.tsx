import { Button, ButtonIconSizes } from "@/components/button";
import { FieldStatus } from "@/components/field-status";
import { TextField, type TextFieldProps } from "@/components/text-field";
import type { IconName } from "@/constants/icons.generated";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

// The icon-only medium_1 button is square: padding on both sides + icon
const BUTTON_SIZE = Spacing.three * 2 + ButtonIconSizes.medium_1;

export type SubmitFieldProps = Omit<
  TextFieldProps,
  "leading" | "trailing" | "onSubmitEditing" | "invalid"
> & {
  onSubmit: () => void;
  /** Whether the input is complete, e.g. a valid email */
  canSubmit: boolean;
  /** While the submit runs: spinner in the button, no second submit */
  loading?: boolean;
  /** Icon of the button at the end of the field */
  submitIcon?: IconName;
  /** What the button does, for screen readers, e.g. "Continue with email" */
  submitLabel: string;
  /** Shown under the field; also outlines the field red */
  error?: string | null;
};

/**
 * Gray pill with centred text and an icon button at its end, for a single
 * value that moves the sign-in flow on (email, password, name). Return
 * submits too
 */
export function SubmitField({
  onSubmit,
  canSubmit,
  loading = false,
  submitIcon = "arrow.right",
  submitLabel,
  error = null,
  style,
  ...rest
}: SubmitFieldProps) {
  const submit = () => {
    if (canSubmit && !loading) onSubmit();
  };

  return (
    <>
      <TextField
        bg="bg3"
        returnKeyType="go"
        {...rest}
        invalid={error !== null}
        onSubmitEditing={submit}
        style={[styles.input, style]}
        // As wide as the button, so the text centres on the whole field
        leading={<View style={styles.spacer} />}
        trailing={
          <Button
            icon={submitIcon}
            type="primary"
            size="medium_1"
            radius="md"
            loading={loading}
            disabled={!canSubmit || loading}
            accessibilityLabel={submitLabel}
            onPress={submit}
          />
        }
      />
      <FieldStatus error={error} />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    textAlign: "center",
  },
  spacer: {
    width: BUTTON_SIZE,
  },
});
