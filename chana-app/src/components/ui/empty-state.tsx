import { ThemedText } from "@/components/ui/themed-text";
import { Spacing } from "@/constants/theme";
import { StyleSheet } from "react-native";

export type EmptyStateProps = {
  children: string;
};

/** Centered hint where content is missing, e.g. "No comments yet." */
export function EmptyState({ children }: EmptyStateProps) {
  return (
    <ThemedText themeColor="fg2" style={styles.text}>
      {children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  text: {
    padding: Spacing.three,
    textAlign: "center",
  },
});
