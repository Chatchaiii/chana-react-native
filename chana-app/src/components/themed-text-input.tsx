import { TextStyles, type TextType } from "@/components/themed-text";
import type { ThemeColor } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { TextInput, type TextInputProps } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
  type?: TextType;
  themeColor?: ThemeColor;
};

/** Unstyled text input in one of the app's text styles and theme colors */
export function ThemedTextInput({
  type = "text",
  themeColor = "fg1",
  style,
  ...rest
}: ThemedTextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      placeholderTextColor={theme.fg3}
      selectionColor={theme.acc1}
      {...rest}
      // Inputs add vertical padding by default; text should sit like ThemedText
      style={[
        TextStyles[type],
        { color: theme[themeColor], padding: 0 },
        style,
      ]}
    />
  );
}
