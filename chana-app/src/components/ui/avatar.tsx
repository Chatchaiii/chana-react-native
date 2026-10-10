import { ThemedText, type TextType } from "@/components/ui/themed-text";
import {
  ContainerSizes,
  Radius,
  type ContainerSize,
  type RadiusKey,
  type ThemeColor,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { getInitials } from "@/utils/strings";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export type AvatarProps = {
  /** Image URL; falls back to the initials of `name` */
  src?: string;
  name?: string;
  size?: ContainerSize;
  radius?: RadiusKey;
  bg?: ThemeColor;
  fg?: ThemeColor;
  /** Text style of the initials, e.g. larger for big avatars */
  initialsType?: TextType;
};

/** Round picture of a person (or place), with initials as fallback */
export function Avatar({
  src,
  name = "Unknown User",
  size = "s",
  radius = "full",
  bg = "bg3",
  fg = "fg2",
  initialsType = "label",
}: AvatarProps) {
  const theme = useTheme();
  const dimension = ContainerSizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: Radius[radius],
          backgroundColor: theme[bg],
        },
      ]}
    >
      {src ? (
        <Image source={src} style={StyleSheet.absoluteFill} />
      ) : (
        <ThemedText type={initialsType} themeColor={fg}>
          {getInitials(name)}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
