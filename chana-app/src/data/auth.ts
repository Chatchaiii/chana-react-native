import type { User } from "@/types/user";

/**
 * Stand-in for the auth backend: one flow for signing in and signing up.
 * The user enters their email and gets a code; existing accounts are signed
 * in, new ones are asked for a name. Accounts with a password can use it
 * instead of a code.
 * TODO: replace with real API calls
 */

type Account = User & { email: string; password?: string };

const ACCOUNTS: Account[] = [
  {
    email: "chadchai@chana.app",
    name: "chadchai",
    handle: "@chadchai",
    password: "chana123",
  },
  { email: "hanshine@chana.app", name: "hanshine", handle: "@hanshine" },
];

/** The code every email "receives" while there's no backend */
export const DEV_CODE = "123456";
export const CODE_LENGTH = DEV_CODE.length;
// Feels like a network round trip, so loading states are visible
const LATENCY = 600;

/** A failed auth step, with a message meant for the user */
export class AuthError extends Error {}

export type CodeResult =
  | { status: "signedIn"; user: User }
  /** No account with this email yet: ask for a name to create it */
  | { status: "needsName" };

const wait = () => new Promise((resolve) => setTimeout(resolve, LATENCY));
const normalize = (email: string) => email.trim().toLowerCase();
const findAccount = (email: string) =>
  ACCOUNTS.find((account) => account.email === normalize(email));
const toUser = ({ name, handle, avatar }: Account): User => ({
  name,
  handle,
  avatar,
});

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Emails a sign-in code; the same call for new and existing accounts */
export async function requestCode(email: string): Promise<void> {
  await wait();
  if (!isValidEmail(email)) throw new AuthError("Enter a valid email.");
}

export async function verifyCode(
  email: string,
  code: string,
): Promise<CodeResult> {
  await wait();
  if (code !== DEV_CODE) throw new AuthError("Incorrect code");
  const account = findAccount(email);
  return account
    ? { status: "signedIn", user: toUser(account) }
    : { status: "needsName" };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<User> {
  await wait();
  const account = findAccount(email);
  // Same message either way, so it doesn't reveal which emails have accounts
  if (!account?.password || account.password !== password) {
    throw new AuthError("Wrong email or password.");
  }
  return toUser(account);
}

/** Creates the account for a verified email */
export async function createAccount(
  email: string,
  name: string,
): Promise<User> {
  await wait();
  const handle = `@${name.trim().toLowerCase().replace(/\s+/g, "")}`;
  const account: Account = {
    email: normalize(email),
    name: name.trim(),
    handle,
  };
  ACCOUNTS.push(account);
  return toUser(account);
}
