import type { Wish } from "@/types/wish";
import { useSyncExternalStore } from "react";

/** Stand-in content until wishes come from real data */
const PLACEHOLDER_WISHES: Wish[] = [
  {
    id: "1",
    name: "Mascara",
    description: "The black one.",
    author: "hanshine",
    image: "https://picsum.photos/seed/chana-place-1/600/480",
    completed: false,
  },
  {
    id: "2",
    name: "Apple",
    description: "A big black one.",
    author: "chadchai",
    image: "https://picsum.photos/seed/chana-place-2/600/480",
    completed: true,
    completedAt: new Date(2026, 8, 12),
  },
  {
    id: "3",
    name: "Noodle",
    description: "Hand-pulled noodles.",
    author: "chadchai",
    completed: true,
    completedAt: new Date(2026, 6, 3),
  },
];

// TODO: save wishes once they come from real data; for now they live in memory.
// Replaced (never mutated) on every change, so it works as a store snapshot
let wishes = PLACEHOLDER_WISHES;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** All wishes, updated live as they're edited anywhere */
export function useWishes(): Wish[] {
  return useSyncExternalStore(subscribe, () => wishes);
}

/** One wish by id, or undefined if it doesn't exist */
export function useWish(id: string): Wish | undefined {
  return useWishes().find((wish) => wish.id === id);
}

export function updateWish(id: string, changes: Partial<Omit<Wish, "id">>) {
  wishes = wishes.map((wish) =>
    wish.id === id ? { ...wish, ...changes } : wish,
  );
  listeners.forEach((listener) => listener());
}

/** Checks or unchecks a wish, stamping when it was completed */
export function setWishCompleted(id: string, completed: boolean) {
  const now = new Date();
  updateWish(id, {
    completed,
    completedAt: completed ? now : undefined,
    toggledAt: now,
  });
}
