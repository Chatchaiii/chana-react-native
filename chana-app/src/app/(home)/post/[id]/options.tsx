import { ActionRow } from "@/components/action-row";
import { List } from "@/components/list";
import { SheetContent } from "@/components/sheet-content";
import { ThemedText } from "@/components/themed-text";
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

      <List type="card" separatorPadding="three">
        <ActionRow icon="square.and.arrow.up" label="Share" onPress={close} />
        <ActionRow icon="link" label="Copy link" onPress={close} />
        <ActionRow icon="bookmark" label="Save" onPress={close} />
      </List>

      <List type="card" separatorPadding="three">
        <ActionRow icon="trash" label="Delete" destructive onPress={close} />
      </List>
    </SheetContent>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: Spacing.two,
  },
});
