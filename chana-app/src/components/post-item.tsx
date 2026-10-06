import { Avatar } from "@/components/avatar";
import { ExpandableText } from "@/components/expandable-text";
import { ImageCarousel } from "@/components/image-carousel";
import { ListItem } from "@/components/list-item";
import { PostActions } from "@/components/post-actions";
import { ThemedPressable } from "@/components/themed-pressable";
import { ListPressDelay } from "@/constants/motion";
import { Spacing } from "@/constants/theme";
import type { Post } from "@/types/post";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export type PostItemProps = {
  post: Post;
  /**
   * feed: tappable, opens the post, text truncated.
   * detail: the post's own page, full text.
   */
  variant?: "feed" | "detail";
};

/** A post: author row, optional photos, the text and its actions */
export function PostItem({ post, variant = "feed" }: PostItemProps) {
  const router = useRouter();
  const openPost = () =>
    router.push({ pathname: "/post/[id]", params: { id: post.id } });

  const content = (
    <>
      <ListItem
        leading={<Avatar name={post.author} size="m" />}
        label={post.author}
        sublabel={post.postedAt}
        onOptionsPress={() =>
          router.push({
            pathname: "/post/[id]/options",
            params: { id: post.id },
          })
        }
      />
      {post.images && post.images.length > 0 ? (
        <ImageCarousel images={post.images} style={styles.part} />
      ) : null}
      <ExpandableText
        title={post.title}
        text={post.text}
        collapsible={variant === "feed"}
        style={styles.part}
      />
      <PostActions
        commentCount={post.commentCount}
        savedCount={post.savedCount}
        // On the post's own page, opening it again would stack a duplicate
        // TODO: on the detail page, jump to the comments instead
        onCommentPress={variant === "feed" ? openPost : () => {}}
        // TODO: save the post
        onSavePress={() => alert("Saving not implemented yet")}
        style={styles.part}
      />
    </>
  );

  if (variant === "detail") return content;

  return (
    // Not one accessibility element, so screen readers still reach the
    // "…" button, photos and "View more" inside
    <ThemedPressable
      accessible={false}
      unstable_pressDelay={ListPressDelay}
      onPress={openPost}
    >
      {content}
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  // Photos, text and actions line up with the author row's padding
  part: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
});
