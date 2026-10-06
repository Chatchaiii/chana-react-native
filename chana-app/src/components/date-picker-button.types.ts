export type DatePickerButtonProps = {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  accessibilityLabel?: string;
};
