export type User = {
  name: string;
  /** e.g. "@chadchai" */
  handle: string;
  /** Image URL; avatars fall back to initials */
  avatar?: string;
};
