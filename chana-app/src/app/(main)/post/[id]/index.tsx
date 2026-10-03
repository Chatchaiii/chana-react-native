import { PostItem } from "@/components/post-item";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { PLACEHOLDER_POSTS } from "@/constants/placeholder-posts";
import { Spacing } from "@/constants/theme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

/** A single post, opened by tapping it in the feed */
export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // TODO: load the post from real data
  const post = PLACEHOLDER_POSTS.find((item) => item.id === id);

  return (
    <>
      <Stack.Screen options={{ title: "Post", headerTransparent: true }} />
      <ScreenScrollView>
        {post ? (
          <PostItem post={post} variant="detail" />
        ) : (
          <ThemedText themeColor="fg2" style={styles.notFound}>
            This post doesn’t exist anymore.
          </ThemedText>
        )}
      </ScreenScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  notFound: {
    padding: Spacing.three,
    textAlign: "center",
  },
});
