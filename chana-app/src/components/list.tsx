import { Separator, type SeparatorProps } from "@/components/separator";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type ListProps = {
  children: ReactNode;
  /** Small heading above the list, e.g. "Notes" */
  subheading?: string;
  /** plain: no background; card: bg1 background with rounded, clipped corners */
  type?: "plain" | "card";
  /** Items in a row that scrolls sideways, with vertical separators */
  horizontal?: boolean;
  /** Separator insets in points, e.g. ActionRowSeparatorInset */
  separatorInsetLeading?: SeparatorProps["insetLeading"];
  separatorInsetTrailing?: SeparatorProps["insetTrailing"];
  style?: StyleProp<ViewStyle>;
  /** Horizontal lists only: style of the scrolling row, e.g. its end padding */
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * Stacks its children (or lines them up with `horizontal`) with a separator
 * between each of them. For long or data-driven lists, use a FlatList with
 * `ItemSeparatorComponent={Separator}`.
 */
export function List({
  children,
  subheading,
  type = "plain",
  horizontal = false,
  separatorInsetLeading,
  separatorInsetTrailing,
  style,
  contentContainerStyle,
}: ListProps) {
  const theme = useTheme();
  const containerStyle = [
    type === "card" && [styles.card, { backgroundColor: theme.bg1 }],
    style,
  ];

  // Children.toArray drops null children, so separators only go between real items
  const items = Children.toArray(children).map((item, index) => (
    <Fragment key={isValidElement(item) ? item.key : index}>
      {index > 0 ? (
        <Separator
          insetLeading={separatorInsetLeading}
          insetTrailing={separatorInsetTrailing}
          vertical={horizontal}
        />
      ) : null}
      {item}
    </Fragment>
  ));

  const subheadingContent = subheading ? (
    <ThemedText type="heading_4" themeColor="fg2" style={styles.subheading}>
      {subheading}
    </ThemedText>
  ) : null;

  return (
    <View style={containerStyle}>
      {subheadingContent}

      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.row, contentContainerStyle]}
        >
          {items}
        </ScrollView>
      ) : (
        <>{items}</>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  subheading: {
    padding: Spacing.three,
  },
  row: {
    gap: Spacing.three,
  },
});
