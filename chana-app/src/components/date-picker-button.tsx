import type { DatePickerButtonProps } from "@/components/date-picker-button.types";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatDate } from "@/utils/dates";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useState } from "react";
import { StyleSheet } from "react-native";

export type { DatePickerButtonProps };

/**
 * Button showing a date; tapping it opens the native date dialog.
 * Android (and web) version — iOS uses date-picker-button.ios.tsx.
 */
export function DatePickerButton({
  value,
  onChange,
  minimumDate,
  maximumDate,
  accessibilityLabel,
}: DatePickerButtonProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <ThemedPressable
        onPress={() => setOpen(true)}
        accessibilityLabel={accessibilityLabel ?? formatDate(value)}
        style={[styles.chip, { backgroundColor: theme.bg2 }]}
      >
        <ThemedIcon icon="calendar" size={14} />
        <ThemedText type="sublabel">{formatDate(value)}</ThemedText>
      </ThemedPressable>

      {/* The dialog opens on mount, so it's only rendered while open */}
      {open && (
        <DateTimePicker
          value={value}
          mode="date"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          accentColor={theme.acc1}
          onValueChange={(_, date) => {
            setOpen(false);
            onChange(date);
          }}
          onDismiss={() => setOpen(false)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.full,
  },
});
