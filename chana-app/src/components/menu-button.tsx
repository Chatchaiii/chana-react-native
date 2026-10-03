import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { Menu02Icon } from "@hugeicons/core-free-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";

/** Header button that opens the side menu. */
export function MenuButton() {
  const navigation = useNavigation();

  return (
    <ThemedPressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <ThemedIcon icon={Menu02Icon} />
    </ThemedPressable>
  );
}
