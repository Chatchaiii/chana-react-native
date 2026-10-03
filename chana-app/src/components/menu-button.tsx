import { ThemedIcon } from "@/components/themed-icon";
import { Menu02Icon } from "@hugeicons/core-free-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";
import { Pressable } from "react-native";

/** Header button that opens the side menu. */
export function MenuButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      hitSlop={8}
    >
      <ThemedIcon icon={Menu02Icon} />
    </Pressable>
  );
}
