import { useHeaderHeight } from "expo-router/react-navigation";
import { Platform, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Content padding for scrollable screens (ScrollView, FlatList, FlashList).
 *
 * iOS handles the top and bottom natively via `contentInsetAdjustmentBehavior="automatic"`,
 * so `contentInsetStyle` only pads on Android, where a transparent header overlaps content.
 * `sideInsetStyle` keeps content clear of the notch in landscape, on both platforms
 * (margins, so they don't override a screen's own content padding).
 */
export function useScreenInsets({ transparentHeader = true } = {}) {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const contentInsetStyle: ViewStyle | undefined =
    Platform.OS === "android"
      ? {
          paddingTop: transparentHeader ? headerHeight : 0,
          paddingBottom: insets.bottom,
        }
      : undefined;

  const sideInsetStyle: ViewStyle = {
    marginLeft: insets.left,
    marginRight: insets.right,
  };

  return {
    contentInsetAdjustmentBehavior: "automatic" as const,
    contentInsetStyle,
    sideInsetStyle,
  };
}
