import { ImageCarousel } from "@/components/image-carousel";
import { InteractionItem } from "@/components/interaction-item";
import { ListItem } from "@/components/list-item";
import { TextItem } from "@/components/text-item";
import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedPressable } from "@/components/themed-pressable";
import { Spacing } from "@/constants/theme";
import type { ImageSource } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export type Post = {
  id: string;
  author: string;
  /** Already formatted, e.g. "2 days ago" */
  postedAt: string;
  commentCount: number;
  savedCount: number;
  text: string;
  images?: (string | ImageSource)[];
};

export type PostItemProps = {
  post: Post;
  /**
   * feed: tappable, opens the post, text truncated.
   * detail: the post's own page, full text.
   */
  variant?: "feed" | "detail";
};

// Wait before the press feedback so scrolling the feed doesn't flash posts
const PRESS_DELAY = 100;

/** A post: author row, optional photos and the text */
export function PostItem({ post, variant = "feed" }: PostItemProps) {
  const router = useRouter();
  const openPost = () =>
    router.push({ pathname: "/post/[id]", params: { id: post.id } });

  const content = (
    <>
      <ListItem
        leading={<ThemedAvatar name={post.author} size="m" />}
        label={post.author}
        sublabel={post.postedAt}
        onOptionsPress={() =>
          router.push({
            pathname: "/post/[id]/options",
            params: { id: post.id },
          })
        }
      />
      {post.images && post.images.length > 0 && (
        <ImageCarousel images={post.images} style={styles.carousel} />
      )}
      <TextItem
        author={post.author}
        text={post.text}
        collapsible={variant === "feed"}
      />
      <InteractionItem
        commentCount={post.commentCount}
        savedCount={post.savedCount}
        // On the post's own page, opening it again would stack a duplicate
        // TODO: on the detail page, jump to the comments instead
        onCommentPress={variant === "feed" ? openPost : () => {}}
        // TODO: save the post
        onSavePress={() => alert("Saving not implemented yet")}
      />
    </>
  );

  if (variant === "detail") return content;

  return (
    // Not one accessibility element, so screen readers still reach the
    // "…" button, photos and "View more" inside
    <ThemedPressable
      accessible={false}
      unstable_pressDelay={PRESS_DELAY}
      onPress={openPost}
    >
      {content}
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  carousel: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
});
