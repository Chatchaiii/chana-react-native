/** A comment on a post */
export type Comment = {
  id: string;
  postId: string;
  author: string;
  /** Already formatted, e.g. "16h ago" */
  postedAt: string;
  text: string;
};

/** Stand-in content until comments come from real data */
export const PLACEHOLDER_COMMENTS: Comment[] = [
  {
    id: "c1",
    postId: "1",
    author: "chadchai",
    postedAt: "16h ago",
    text: "ble",
  },
  {
    id: "c2",
    postId: "1",
    author: "chadchai",
    postedAt: "2h ago",
    text: "Looks great!",
  },
  {
    id: "c3",
    postId: "2",
    author: "chadchai",
    postedAt: "1d ago",
    text: "Where was this taken?",
  },
];
