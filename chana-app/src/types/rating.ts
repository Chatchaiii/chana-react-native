export type RatingValue = 1 | 2 | 3 | 4 | 5;

/** One person's rating of something */
export type UserRating = {
  author: string;
  value: RatingValue;
};
