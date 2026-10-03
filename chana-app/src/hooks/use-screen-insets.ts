import { useHeaderHeight } from "expo-router/react-navigation";
import { Platform, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Content padding for scrollable screens (ScrollView, FlatList, FlashList).
 *
 * iOS handles insets natively via `contentInsetAdjustmentBehavior="automatic"`,
 * so this only returns padding on Android, where a transparent header overlaps content.
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

  return {
    contentInsetAdjustmentBehavior: "automatic" as const,
    contentInsetStyle,
  };
}
