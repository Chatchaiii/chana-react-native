import type { ImageSource } from "expo-image";

export type Wish = {
  id: string;
  name: string;
  description: string;
  /** Who added the wish */
  author: string;
  image?: string | ImageSource;
  completed: boolean;
  /** When it was completed; only meaningful while `completed` */
  completedAt?: Date;
  /** When it was last checked or unchecked; lists keep it a moment after it leaves them */
  toggledAt?: Date;
};
