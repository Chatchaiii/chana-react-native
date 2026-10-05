import {
  ThemedButton,
  type ThemedButtonProps,
} from "@/components/themed-button";

export type ThemedCheckItemProps = ThemedButtonProps;

/**
 * Shows whether something is done, e.g. a place being visited. Renders a
 * ThemedButton for now; check-specific behavior goes here.
 */
export function ThemedCheckItem(props: ThemedCheckItemProps) {
  return <ThemedButton {...props} />;
}
