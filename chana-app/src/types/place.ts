import type { UserRating } from "@/types/rating";
import type { ImageSource } from "expo-image";

export type Place = {
  id: string;
  name: string;
  description: string;
  /** Who added the place */
  author: string;
  address?: string;
  /** Already formatted, e.g. "4 km" */
  distance: string;
  /** One rating per person who rated it */
  ratings: UserRating[];
  image?: string | ImageSource;
  visited?: boolean;
  visitedOn?: Date;
};
