import {
  ActionItem,
  ActionItemSeparatorInset,
} from "@/components/ui/action-item";
import { List } from "@/components/ui/list";
import { SheetContent } from "@/components/layout/sheet-content";
import { ThemedText } from "@/components/ui/themed-text";
import { Spacing } from "@/constants/theme";
import { PLACEHOLDER_POSTS } from "@/data/posts";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";

/** Sheet with the options for one post, opened from its "…" button */
export default function PostOptions() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const post = PLACEHOLDER_POSTS.find((item) => item.id === id);

  // TODO: implement each action for `post`; for now they just close the sheet
  const close = () => router.back();

  return (
    <SheetContent>
      {post ? (
        <ThemedText type="heading_4" themeColor="fg2" style={styles.title}>
          Post by {post.author}
        </ThemedText>
      ) : null}

      <List type="card" separatorInsetLeading={ActionItemSeparatorInset}>
        <ActionItem icon="bookmark" label="Bookmark" onPress={close} />
        <ActionItem icon="square.and.arrow.up" label="Share" onPress={close} />
        <ActionItem icon="link" label="Copy link" onPress={close} />
      </List>

      <List type="card" separatorInsetLeading={ActionItemSeparatorInset}>
        <ActionItem icon="pen.2" label="Edit" onPress={close} />
      </List>

      <List type="card">
        <ActionItem icon="archive" label="Archive" onPress={close} />
        <ActionItem icon="trash" label="Delete" destructive onPress={close} />
      </List>
    </SheetContent>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: Spacing.two,
  },
});
