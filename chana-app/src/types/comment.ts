/** A comment on a post */
export type Comment = {
  id: string;
  postId: string;
  author: string;
  /** Already formatted, e.g. "16h ago" */
  postedAt: string;
  text: string;
};
