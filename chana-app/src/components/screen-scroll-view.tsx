import { useScreenInsets } from "@/hooks/use-screen-insets";
import { ScrollView, type ScrollViewProps } from "react-native";

export type ScreenScrollViewProps = ScrollViewProps & {
  /** Content starts under a transparent header (Android pads it down) */
  transparentHeader?: boolean;
};

/** Root ScrollView of a screen, inset below the header and home indicator */
export function ScreenScrollView({
  transparentHeader,
  contentContainerStyle,
  ...rest
}: ScreenScrollViewProps) {
  const { contentInsetAdjustmentBehavior, contentInsetStyle } = useScreenInsets(
    { transparentHeader },
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      contentContainerStyle={[contentInsetStyle, contentContainerStyle]}
      {...rest}
    />
  );
}
