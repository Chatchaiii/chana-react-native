import { Separator, type SeparatorProps } from "@/components/separator";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Children, Fragment, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export type ListType = "plain" | "card";

export type ListProps = {
  children: ReactNode;
  /** plain: no background; card: bg1 background with rounded, clipped corners */
  type?: ListType;
  separatorPadding?: SeparatorProps["padding"];
  style?: StyleProp<ViewStyle>;
};

export function List({
  children,
  type = "plain",
  separatorPadding,
  style,
}: ListProps) {
  const theme = useTheme();
  const items = Children.toArray(children);

  return (
    <View
      style={[
        type === "card" && [styles.card, { backgroundColor: theme.bg1 }],
        style,
      ]}
    >
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <Separator padding={separatorPadding} />}
          {item}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
