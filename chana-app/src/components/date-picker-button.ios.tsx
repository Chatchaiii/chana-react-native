import type { DatePickerButtonProps } from "@/components/date-picker-button.types";
import { useTheme } from "@/hooks/use-theme";
import { DatePicker, Host } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as accessibilityLabelModifier,
  datePickerStyle,
  labelsHidden,
  tint,
} from "@expo/ui/swift-ui/modifiers";

/**
 * Button showing a date; tapping it opens the native calendar popover.
 * iOS uses SwiftUI's compact DatePicker.
 */
export function DatePickerButton({
  value,
  onChange,
  minimumDate,
  maximumDate,
  accessibilityLabel,
}: DatePickerButtonProps) {
  const theme = useTheme();

  return (
    <Host matchContents>
      <DatePicker
        selection={value}
        displayedComponents={["date"]}
        range={
          minimumDate || maximumDate
            ? { start: minimumDate, end: maximumDate }
            : undefined
        }
        onDateChange={onChange}
        modifiers={[
          tint(theme.acc1),
          datePickerStyle("compact"),
          labelsHidden(),
          ...(accessibilityLabel
            ? [accessibilityLabelModifier(accessibilityLabel)]
            : []),
        ]}
      />
    </Host>
  );
}
