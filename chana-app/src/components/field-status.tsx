import { ThemedText } from "@/components/themed-text";
import { ActivityIndicator, StyleSheet, View } from "react-native";

// Height of iOS's small spinner, so the line is as tall with it as with text
const STATUS_HEIGHT = 20;

export type FieldStatusProps = {
  error?: string | null;
  /** Shows a spinner instead, e.g. while a code is checked */
  loading?: boolean;
  /** Keeps the line's height while there's nothing to show, so nothing jumps */
  reserveSpace?: boolean;
};

/** The line under a field: a spinner while its value is checked, or the error */
export function FieldStatus({
  error = null,
  loading = false,
  reserveSpace = false,
}: FieldStatusProps) {
  if (!loading && !error && !reserveSpace) return null;

  return (
    <View style={styles.status}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : error ? (
        <ThemedText
          type="subtext"
          themeColor="neg1"
          accessibilityRole="alert"
          style={styles.text}
        >
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    minHeight: STATUS_HEIGHT,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});
