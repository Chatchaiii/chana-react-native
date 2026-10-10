import { FieldStatus } from "@/components/field-status";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const BOX_HEIGHT = 56;
const BORDER_WIDTH = 2;

export type CodeInputProps = {
  value: string;
  onChangeText: (code: string) => void;
  /** Number of digits */
  length: number;
  autoFocus?: boolean;
  /** While the code is checked: a spinner under the boxes */
  loading?: boolean;
  /** Shown under the boxes; also outlines them red, e.g. after a wrong code */
  error?: string | null;
};

/**
 * One box per digit of a verification code. A single invisible input sits on
 * top, so typing, pasting and iOS's code autofill from Mail/Messages all work
 */
export function CodeInput({
  value,
  onChangeText,
  length,
  autoFocus = false,
  loading = false,
  error = null,
}: CodeInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(autoFocus);

  return (
    <View style={styles.content}>
      <Pressable accessible={false} style={styles.row}>
        {Array.from({ length }, (_, index) => {
          // The box the next digit goes into
          const active =
            focused && index === Math.min(value.length, length - 1);

          return (
            <View
              key={index}
              style={[
                styles.box,
                {
                  backgroundColor: theme.bg1,
                  borderColor: error
                    ? theme.neg1
                    : active
                      ? theme.acc1
                      : "transparent",
                },
              ]}
            >
              <ThemedText type="heading_3">{value[index] ?? ""}</ThemedText>
            </View>
          );
        })}

        <ThemedTextInput
          value={value}
          // Digits only, so a pasted "123 456" still fills the boxes
          onChangeText={(text) =>
            onChangeText(text.replace(/\D/g, "").slice(0, length))
          }
          maxLength={length}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          autoFocus={autoFocus}
          caretHidden
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={`Verification code, ${length} digits`}
          // Covers the boxes, so tapping any of them focuses it; nearly
          // transparent rather than hidden, so iOS still offers autofill
          style={styles.hiddenInput}
        />
      </Pressable>

      {/* Always takes its line, so the links below don't jump */}
      <FieldStatus error={error} loading={loading} reserveSpace />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.two,
    gap: Spacing.three,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.one,
  },
  box: {
    flex: 1,
    height: BOX_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: BORDER_WIDTH,
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.02,
    color: "transparent",
  },
});
