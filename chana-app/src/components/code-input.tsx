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
  /** Red outlines, e.g. after a wrong code */
  invalid?: boolean;
  autoFocus?: boolean;
};

/**
 * One box per digit of a verification code. A single invisible input sits on
 * top, so typing, pasting and iOS's code autofill from Mail/Messages all work
 */
export function CodeInput({
  value,
  onChangeText,
  length,
  invalid = false,
  autoFocus = false,
}: CodeInputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(autoFocus);

  return (
    <Pressable accessible={false} style={styles.row}>
      {Array.from({ length }, (_, index) => {
        // The box the next digit goes into
        const active = focused && index === Math.min(value.length, length - 1);

        return (
          <View
            key={index}
            style={[
              styles.box,
              {
                backgroundColor: theme.bg1,
                borderColor: invalid
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
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  box: {
    flex: 1,
    height: BOX_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.xs,
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
