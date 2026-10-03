import { Separator, type SeparatorProps } from "@/components/separator";
import { Radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export type ListProps = {
  children: ReactNode;
  /** plain: no background; card: bg1 background with rounded, clipped corners */
  type?: "plain" | "card";
  separatorPadding?: SeparatorProps["padding"];
  style?: StyleProp<ViewStyle>;
};

/**
 * Stacks its children with a separator between each of them. For long or
 * data-driven lists, use a FlatList with `ItemSeparatorComponent={Separator}`.
 */
export function List({
  children,
  type = "plain",
  separatorPadding,
  style,
}: ListProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        type === "card" && [styles.card, { backgroundColor: theme.bg1 }],
        style,
      ]}
    >
      {Children.toArray(children).map((item, index) => (
        <Fragment key={isValidElement(item) ? item.key : index}>
          {index > 0 && <Separator padding={separatorPadding} />}
          {item}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
