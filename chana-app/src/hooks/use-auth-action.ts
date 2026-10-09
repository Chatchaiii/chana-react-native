import { AuthError } from "@/data/auth";
import { useState } from "react";

/**
 * Runs one auth step at a time and tracks it: `pending` while it runs,
 * `error` (a message for the user) if it fails
 */
export function useAuthAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      await action();
    } catch (caught) {
      setError(
        caught instanceof AuthError
          ? caught.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setPending(false);
    }
  };

  return { pending, error, clearError: () => setError(null), run };
}
