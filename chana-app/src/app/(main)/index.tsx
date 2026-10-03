import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { ThemedText } from "@/components/themed-text";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <TabScreen create={Tabs.home.create}>
      <ScreenScrollView contentContainerStyle={styles.body}>
        <ThemedText>Welcome to Chana!</ThemedText>
      </ScreenScrollView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.five,
  },
  row_3: {
    flexDirection: "row",
    gap: Spacing.three,
  },
});
