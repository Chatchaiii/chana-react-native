import { useScreenInsets } from "@/hooks/use-screen-insets";
import { ScrollView, type ScrollViewProps } from "react-native";

export type ScreenScrollViewProps = {
  transparentHeader?: boolean;
};

export function ScreenScrollView({
  transparentHeader,
  contentContainerStyle,
  ...otherProps
}: ScreenScrollViewProps & ScrollViewProps) {
  const { contentInsetAdjustmentBehavior, contentInsetStyle } =
    useScreenInsets({ transparentHeader });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      contentContainerStyle={[contentInsetStyle, contentContainerStyle]}
      {...otherProps}
    />
  );
}
