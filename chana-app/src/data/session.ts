import type { User } from "@/types/user";
import { useSyncExternalStore } from "react";

// TODO: keep the session (e.g. a token in expo-secure-store) so it survives
// restarts; for now it lives in memory and the app starts signed out
let session: User | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The signed-in user, or null when signed out */
export function useSession(): User | null {
  return useSyncExternalStore(subscribe, () => session);
}

function setSession(next: User | null) {
  session = next;
  listeners.forEach((listener) => listener());
}

export function signIn(user: User) {
  setSession(user);
}

export function signOut() {
  setSession(null);
}
