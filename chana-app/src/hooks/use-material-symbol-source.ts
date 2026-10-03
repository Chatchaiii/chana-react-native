import {
  type AndroidSymbol,
  unstable_getMaterialSymbolSourceAsync,
} from "expo-symbols";
import { useEffect, useState } from "react";
import { Platform, type ImageSourcePropType } from "react-native";

/**
 * Renders a Material Symbol to an image source on Android, for native APIs
 * (like toolbar buttons) that can't use SF Symbols there. Always null on iOS.
 */
export function useMaterialSymbolSource(
  symbol: AndroidSymbol,
  size = 24,
  color = "#000000",
) {
  const [source, setSource] = useState<ImageSourcePropType | null>(null);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    let cancelled = false;
    unstable_getMaterialSymbolSourceAsync(symbol, size, color).then((image) => {
      if (!cancelled) setSource(image);
    });
    return () => {
      cancelled = true;
    };
  }, [symbol, size, color]);

  return source;
}
