import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useKeyboardPadding } from "@/hooks/use-keyboard-padding";
import { useTheme } from "@/hooks/use-theme";
import { useHeaderHeight } from "expo-router/react-navigation";
import type { ComponentProps, ReactNode } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  View,
  type ViewProps,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AuthScreenProps = {
  title?: string;
  subtitle?: string;
  /** Above the title, e.g. the Wordmark */
  header?: ReactNode;
  /** The form: fields, error and buttons, kept just above the keyboard */
  children: ReactNode;
  /** Small print under the form */
  footer?: ReactNode;
  /** Animated style for the form and footer, e.g. fading them in */
  contentStyle?: ComponentProps<typeof Animated.View>["style"];
  contentPointerEvents?: ViewProps["pointerEvents"];
};

/**
 * Layout of every step of signing in: title at the top, the form at the
 * bottom riding on the keyboard. Tapping outside the form closes the keyboard
 */
export function AuthScreen({
  title,
  subtitle,
  header,
  children,
  footer,
  contentStyle,
  contentPointerEvents,
}: AuthScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const keyboardPadding = useKeyboardPadding(Spacing.three);

  return (
    <Animated.View
      style={[
        styles.screen,
        {
          backgroundColor: theme.bg2,
          // Below the (transparent) header, or the status bar without one
          paddingTop: Math.max(headerHeight, insets.top) + Spacing.four,
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
        keyboardPadding,
      ]}
    >
      <Pressable
        accessible={false}
        onPress={Keyboard.dismiss}
        style={styles.intro}
      >
        {header}

        {title || subtitle ? (
          <View style={styles.titles}>
            {title ? <ThemedText type="heading_3">{title}</ThemedText> : null}
            {subtitle ? (
              <ThemedText themeColor="fg2">{subtitle}</ThemedText>
            ) : null}
          </View>
        ) : null}
      </Pressable>

      <Animated.View style={contentStyle} pointerEvents={contentPointerEvents}>
        <View style={styles.form}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // Takes the free space, so the form sits at the bottom
  intro: {
    flex: 1,
    gap: Spacing.five,
  },
  titles: {
    gap: Spacing.two,
  },
  form: {
    gap: Spacing.two,
  },
  footer: {
    marginTop: Spacing.three,
  },
});
