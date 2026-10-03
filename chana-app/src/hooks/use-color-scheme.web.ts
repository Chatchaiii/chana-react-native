import { useSyncExternalStore } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

const subscribe = () => () => {};

/**
 * Static web rendering has no color scheme, so use light until the client has
 * hydrated (server snapshot = false, client snapshot = true).
 */
export function useColorScheme() {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();

  return hydrated ? colorScheme : "light";
}
