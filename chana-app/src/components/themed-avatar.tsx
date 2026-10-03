import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getInitials } from "@/constants/functions";
import {
  IconBorderRadii,
  IconBorderRadius,
  IconContainerSize,
  IconContainerSizes,
  ThemeColor,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { type TextProps, Image, StyleSheet } from "react-native";

export type ThemedIconProps = {
  src?: string | undefined;
  radius?: IconBorderRadius;
  bg?: ThemeColor;
  fg?: ThemeColor;
  size?: IconContainerSize;
  name?: string;
};

export function ThemedAvatar({
  src,
  radius = "round",
  bg,
  fg,
  size,
  name = "Unknown User",
}: ThemedIconProps & TextProps) {
  const theme = useTheme();

  return (
    <ThemedView
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme[bg ?? "bg3"],
          height: IconContainerSizes[size ?? "s"],
          width: IconContainerSizes[size ?? "s"],
          borderRadius: IconBorderRadii[radius],
          overflow: "hidden",
        },
      ]}
    >
      {src ? (
        <Image source={{ uri: src }} style={[StyleSheet.absoluteFill]} />
      ) : (
        <ThemedText type="label" style={{ color: theme[fg ?? "fg2"] }}>
          {getInitials(name)}
        </ThemedText>
      )}
    </ThemedView>
  );
}
