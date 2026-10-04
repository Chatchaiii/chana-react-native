import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { ArrowRight01Icon, EllipsisIcon } from "@hugeicons/core-free-icons";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export type ListItemProps = {
  label: string;
  /** Small detail shown right after the label, e.g. "16h ago" */
  addOn?: string;
  sublabel?: string;
  /** Lines the sublabel may take before truncating */
  sublabelLines?: number;
  /** Left side, e.g. a ThemedAvatar or Thumbnail */
  leading?: ReactNode;
  /** Small line above the label, e.g. the author and distance */
  overline?: ReactNode;
  /** Below the sublabel, e.g. a Rating */
  footer?: ReactNode;
  /** Shows the trailing "…" button when set */
  onOptionsPress?: () => void;
  /** Makes the whole row pressable and shows a chevron */
  onPress?: () => void;
};

// Wait before the press feedback so scrolling a list doesn't flash rows
const PRESS_DELAY = 100;

/**
 * Generic list row: leading slot, label with optional overline, add-on,
 * sublabel and footer, then a "…" button or a chevron. Domain rows
 * (PostItem, PlaceItem) build on it.
 */
export function ListItem({
  label,
  addOn,
  sublabel,
  sublabelLines = 2,
  leading,
  overline,
  footer,
  onOptionsPress,
  onPress,
}: ListItemProps) {
  const content = (
    <>
      {leading}

      <View style={styles.text}>
        {overline}

        <View style={styles.labelRow}>
          {/* Truncates first, so a long label never pushes the add-on away */}
          <ThemedText type="label" numberOfLines={1} style={styles.label}>
            {label}
          </ThemedText>
          {/* Ternaries, not &&: an empty string outside <Text> would crash */}
          {addOn ? (
            <ThemedText type="sublabel" themeColor="fg2">
              {addOn}
            </ThemedText>
          ) : null}
        </View>

        {sublabel ? (
          <ThemedText
            type="sublabel"
            themeColor="fg2"
            numberOfLines={sublabelLines}
          >
            {sublabel}
          </ThemedText>
        ) : null}

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>

      {onOptionsPress && (
        <ThemedPressable
          onPress={onOptionsPress}
          hitSlop={12}
          accessibilityLabel="Options"
        >
          <ThemedIcon icon={EllipsisIcon} />
        </ThemedPressable>
      )}
      {onPress && <ThemedIcon icon={ArrowRight01Icon} themeColor="fg3" />}
    </>
  );

  if (!onPress) return <View style={styles.row}>{content}</View>;

  return (
    <ThemedPressable
      onPress={onPress}
      unstable_pressDelay={PRESS_DELAY}
      accessibilityLabel={label}
      // With an options button inside, stay a container so it's reachable
      accessible={!onOptionsPress}
      style={styles.row}
    >
      {content}
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    gap: Spacing.three,
  },
  text: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  label: {
    flexShrink: 1,
  },
  footer: {
    marginTop: Spacing.one,
  },
});
