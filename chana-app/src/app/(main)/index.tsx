import { List } from "@/components/list";
import { PostItem } from "@/components/post-item";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

const demoImages = [1, 2, 3, 4].map(
  (n) => `https://picsum.photos/seed/chana-${n}/800/1000`,
);

export default function Index() {
  return (
    <TabScreen create={Tabs.home.create}>
      <ScreenScrollView contentContainerStyle={styles.body}>
        <List>
          <PostItem />
          <PostItem images={demoImages} />
        </List>
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
