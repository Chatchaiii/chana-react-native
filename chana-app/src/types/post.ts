import type { ImageSource } from "expo-image";

export type Post = {
  id: string;
  author: string;
  postedAt: Date;
  commentCount: number;
  savedCount: number;
  title: string;
  text: string;
  images?: (string | ImageSource)[];
};
