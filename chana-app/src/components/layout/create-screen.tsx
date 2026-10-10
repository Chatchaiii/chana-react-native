import { ScreenScrollView } from "@/components/layout/screen-scroll-view";
import type { CreatableTab } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { Stack } from "expo-router";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";

export type CreateScreenProps = {
  tab: CreatableTab;
  /** The form; empty until the tab has one */
  children?: ReactNode;
};

/** Modal opened by a tab's create button (each tab's `new.tsx`) */
export function CreateScreen({ tab, children }: CreateScreenProps) {
  return (
    <>
      <Stack.Screen options={{ headerTitle: tab.create.label }} />
      <ScreenScrollView
        transparentHeader={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {children}
      </ScreenScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
});
