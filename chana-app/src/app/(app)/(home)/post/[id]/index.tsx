import { Avatar } from "@/components/avatar";
import { CommentComposer } from "@/components/comment-composer";
import { EmptyState } from "@/components/empty-state";
import { List } from "@/components/list";
import { ListItem } from "@/components/list-item";
import { PostItem } from "@/components/post-item";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { Separator } from "@/components/separator";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { addComment, useComments } from "@/data/comments";
import { CURRENT_USER } from "@/data/current-user";
import { PLACEHOLDER_POSTS } from "@/data/posts";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

/** A single post with its comments, opened by tapping it in the feed */
export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: load the post from real data
  const post = PLACEHOLDER_POSTS.find((item) => item.id === id);
  const comments = useComments(id);
  const scrollRef = useRef<ScrollView>(null);

  // TODO: open a sheet with the comment's options
  const openCommentOptions = () => alert("Not implemented yet");

  const sendComment = (text: string) => {
    addComment(id, CURRENT_USER.name, text);
    // The new comment is last; bring it into view once it has rendered
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd());
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Post", headerTransparent: true }} />
      <ScreenScrollView
        ref={scrollRef}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      >
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
                    sublabelLines={0}
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

      {post ? <CommentComposer onSend={sendComment} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
});
