import { ImageCarousel } from "@/components/image-carousel";
import { ListItem } from "@/components/list-item";
import { TextItem } from "@/components/text-item";
import { Spacing } from "@/constants/theme";
import type { ImageSource } from "expo-image";
import { StyleSheet } from "react-native";

export type Post = {
  id: string;
  author: string;
  /** Already formatted, e.g. "2 days ago" */
  postedAt: string;
  text: string;
  images?: (string | ImageSource)[];
};

export type PostItemProps = {
  post: Post;
};

/** A post: author row, optional photos and the (truncated) text */
export function PostItem({ post }: PostItemProps) {
  return (
    <>
      <ListItem title={post.author} subtitle={post.postedAt} />
      {post.images && post.images.length > 0 && (
        <ImageCarousel images={post.images} style={styles.carousel} />
      )}
      <TextItem author={post.author} text={post.text} />
    </>
  );
}

const styles = StyleSheet.create({
  carousel: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
});
