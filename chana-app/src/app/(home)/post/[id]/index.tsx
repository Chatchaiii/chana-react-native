import { Avatar } from "@/components/avatar";
import { EmptyState } from "@/components/empty-state";
import { List } from "@/components/list";
import { ListItem } from "@/components/list-item";
import { PostItem } from "@/components/post-item";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { Separator } from "@/components/separator";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { PLACEHOLDER_COMMENTS } from "@/data/comments";
import { PLACEHOLDER_POSTS } from "@/data/posts";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

/** A single post with its comments, opened by tapping it in the feed */
export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: load the post and its comments from real data
  const post = PLACEHOLDER_POSTS.find((item) => item.id === id);
  const comments = PLACEHOLDER_COMMENTS.filter((item) => item.postId === id);

  // TODO: open a sheet with the comment's options
  const openCommentOptions = () => alert("Not implemented yet");

  return (
    <>
      <Stack.Screen options={{ title: "Post", headerTransparent: true }} />
      <ScreenScrollView>
        {post ? (
          <>
            <PostItem post={post} variant="detail" />
            <Separator />

            <ThemedText type="label" style={styles.sectionTitle}>
              Comments
            </ThemedText>
            {comments.length > 0 ? (
              <List>
                {comments.map((comment) => (
                  <ListItem
                    key={comment.id}
                    leading={<Avatar name={comment.author} size="m" />}
                    label={comment.author}
                    addOn={comment.postedAt}
                    sublabel={comment.text}
                    onOptionsPress={openCommentOptions}
                  />
                ))}
              </List>
            ) : (
              <EmptyState>No comments yet.</EmptyState>
            )}
          </>
        ) : (
          <EmptyState>This post doesn’t exist anymore.</EmptyState>
        )}
      </ScreenScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
});
