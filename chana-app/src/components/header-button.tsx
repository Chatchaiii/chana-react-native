import {
  ThemedPressable,
  type ThemedPressableProps,
} from "@/components/themed-pressable";
import { ContainerSizes } from "@/constants/theme";
import { StyleSheet } from "react-native";

/**
 * Tappable area for a custom header button. iOS draws a glass circle around
 * header items; the pressable fills it (36pt = the circle minus its padding),
 * so taps on the circle don't fall through to the header, which scrolls to top
 */
export function HeaderButton({ style, ...rest }: ThemedPressableProps) {
  return <ThemedPressable {...rest} style={[styles.button, style]} />;
}

const styles = StyleSheet.create({
  button: {
    width: ContainerSizes.s,
    height: ContainerSizes.s,
    alignItems: "center",
    justifyContent: "center",
  },
});
