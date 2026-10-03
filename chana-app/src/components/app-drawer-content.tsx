import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import {
  type DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "expo-router/drawer";
import { StyleSheet } from "react-native";

export function AppDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <ThemedText type="subtitle" style={styles.title}>
        Chana
      </ThemedText>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  title: {
    paddingHorizontal: Spacing.two,
  },
});
