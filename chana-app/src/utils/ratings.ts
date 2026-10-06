import type { RatingValue, UserRating } from "@/components/rating";

/** Mean of the ratings' values, 0 when there are none */
export function averageRating(ratings: UserRating[]): number {
  if (ratings.length === 0) return 0;
  return (
    ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
  );
}

/** 4 → "4", 4.333 → "4.3" */
export function formatRating(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

/** Sets `author`'s rating, replacing theirs or adding it at the end */
export function withUserRating(
  ratings: UserRating[],
  author: string,
  value: RatingValue,
): UserRating[] {
  return ratings.some((rating) => rating.author === author)
    ? ratings.map((rating) =>
        rating.author === author ? { ...rating, value } : rating,
      )
    : [...ratings, { author, value }];
}
