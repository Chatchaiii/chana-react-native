import { List } from "@/components/list";
import { PostItem } from "@/components/post-item";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { Tabs } from "@/constants/tabs";
import { PLACEHOLDER_POSTS } from "@/data/posts";

export default function Home() {
  return (
    // Home shows no title in the header
    <TabScreen tab={Tabs.home} title="">
      <ScreenScrollView>
        <List>
          {PLACEHOLDER_POSTS.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </List>
      </ScreenScrollView>
    </TabScreen>
  );
}
