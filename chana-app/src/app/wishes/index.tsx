import { List } from "@/components/list";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { WishItem, WishItemSeparatorInset } from "@/components/wish-item";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { useWishes } from "@/data/wishes";
import { StyleSheet } from "react-native";

export default function Wishes() {
  const wishes = useWishes();

  return (
    <TabScreen tab={Tabs.wishes}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        // Taps on the ⓘ button work while the keyboard is up; taps elsewhere close it
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <List type="card" separatorInsetLeading={WishItemSeparatorInset}>
          {wishes.map((wish) => (
            <WishItem key={wish.id} wish={wish} />
          ))}
        </List>
      </ScreenScrollView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
  },
});
