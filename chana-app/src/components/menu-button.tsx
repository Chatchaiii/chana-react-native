import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";

/** Header button that opens the side menu */
export function MenuButton() {
  const navigation = useNavigation();

  return (
    <ThemedPressable
      accessibilityLabel="Open menu"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <ThemedIcon icon="line.3.horizontal" />
    </ThemedPressable>
  );
}
