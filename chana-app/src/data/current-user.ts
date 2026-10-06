import type { User } from "@/types/user";

/** Stand-in for the signed-in user until there's authentication */
export const CURRENT_USER: User = {
  name: "chadchai",
  handle: "@chadchai",
};
