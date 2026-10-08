import { useScreenInsets } from "@/hooks/use-screen-insets";
import { ScrollView, type ScrollViewProps } from "react-native";

export type ScreenScrollViewProps = ScrollViewProps & {
  /** Content starts under a transparent header (Android pads it down) */
  transparentHeader?: boolean;
};

/** Root ScrollView of a screen, inset below the header, above the home indicator and beside the notch */
export function ScreenScrollView({
  transparentHeader,
  style,
  contentContainerStyle,
  ...rest
}: ScreenScrollViewProps) {
  const { contentInsetAdjustmentBehavior, contentInsetStyle, sideInsetStyle } =
    useScreenInsets({ transparentHeader });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      style={[sideInsetStyle, style]}
      contentContainerStyle={[contentInsetStyle, contentContainerStyle]}
      {...rest}
    />
  );
}
