import type { ImageSource } from "expo-image";

export type Post = {
  id: string;
  author: string;
  /** Already formatted, e.g. "2 days ago" */
  postedAt: string;
  commentCount: number;
  savedCount: number;
  title: string;
  text: string;
  images?: (string | ImageSource)[];
};
