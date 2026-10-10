import { List } from "@/components/ui/list";
import { PostItem } from "@/components/posts/post-item";
import { ScreenScrollView } from "@/components/layout/screen-scroll-view";
import { TabScreen } from "@/components/layout/tab-screen";
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
