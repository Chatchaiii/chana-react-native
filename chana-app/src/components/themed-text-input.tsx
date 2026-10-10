import { TextStyles, type TextType } from "@/components/themed-text";
import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { HapticStyles, playNotification } from "@/utils/haptics";
import type { NotificationFeedbackType } from "expo-haptics";
import { TextInput, type TextInputProps } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
  type?: TextType;
  themeColor?: ThemeColor;
  /** Haptic played when the input gains focus; false turns it off */
  focusHaptic?: NotificationFeedbackType | false;
  /** Haptic played when the input loses focus; false turns it off */
  blurHaptic?: NotificationFeedbackType | false;
};

/** Unstyled text input in one of the app's text styles and theme colors */
export function ThemedTextInput({
  type = "text",
  themeColor = "fg1",
  focusHaptic = HapticStyles.focus,
  blurHaptic = HapticStyles.blur,
  onFocus,
  onBlur,
  style,
  ...rest
}: ThemedTextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      placeholderTextColor={theme.fg3}
      selectionColor={theme.acc1}
      {...rest}
      // Haptics run alongside the caller's handlers, not instead of them
      onFocus={(event) => {
        if (focusHaptic !== false) playNotification(focusHaptic);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (blurHaptic !== false) playNotification(blurHaptic);
        onBlur?.(event);
      }}
      // Inputs add vertical padding by default; text should sit like ThemedText
      style={[
        TextStyles[type],
        {
          color: theme[themeColor],
          padding: 0,
        },
        style,
      ]}
    />
  );
}
