import { Button } from "@/components/button";
import { TextField, type TextFieldProps } from "@/components/text-field";
import { ThemedText } from "@/components/themed-text";
import { StyleSheet } from "react-native";

export type SubmitFieldProps = Omit<
  TextFieldProps,
  "trailing" | "onSubmitEditing" | "invalid"
> & {
  onSubmit: () => void;
  /** Whether the input is complete, e.g. a valid email */
  canSubmit: boolean;
  /** While the submit runs: spinner in the button, no second submit */
  loading?: boolean;
  /** Label of the button under the field, e.g. "Continue with email" */
  submitLabel: string;
  /** Shown between the field and the button; also outlines the field red */
  error?: string | null;
};

/**
 * Gray field with centred text and a full-width button under it, for a single
 * value that moves the sign-in flow on (email, password, name). Return
 * submits too
 */
export function SubmitField({
  onSubmit,
  canSubmit,
  loading = false,
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
      />
      {error ? (
        <ThemedText type="sublabel" themeColor="neg1" style={styles.input}>
          {error}
        </ThemedText>
      ) : null}
      <Button
        label={submitLabel}
        type="primary"
        size="medium_1"
        radius="md"
        fullWidth
        loading={loading}
        disabled={!canSubmit || loading}
        onPress={submit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    textAlign: "center",
  },
});
