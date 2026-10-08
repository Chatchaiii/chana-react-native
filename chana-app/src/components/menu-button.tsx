import { HeaderButton } from "@/components/header-button";
import { ThemedIcon } from "@/components/themed-icon";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";

/** Header button that opens the side menu */
export function MenuButton() {
  const navigation = useNavigation();

  return (
    <HeaderButton
      accessibilityLabel="Open menu"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <ThemedIcon icon="line.3.horizontal" />
    </HeaderButton>
  );
}
