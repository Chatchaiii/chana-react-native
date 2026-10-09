import type { Comment } from "@/types/comment";
import { useSyncExternalStore } from "react";

/** Stand-in content until comments come from real data */
const PLACEHOLDER_COMMENTS: Comment[] = [
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

// TODO: save comments once they come from real data; for now they live in memory.
// Replaced (never mutated) on every change, so it works as a store snapshot
let comments = PLACEHOLDER_COMMENTS;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** All comments on a post, oldest first, updated live */
export function useComments(postId: string): Comment[] {
  const all = useSyncExternalStore(subscribe, () => comments);
  return all.filter((comment) => comment.postId === postId);
}

export function addComment(postId: string, author: string, text: string) {
  comments = [
    ...comments,
    {
      id: `c${Date.now()}`,
      postId,
      author,
      // TODO: store a date and format it relative to now
      postedAt: "now",
      text,
    },
  ];
  listeners.forEach((listener) => listener());
}
