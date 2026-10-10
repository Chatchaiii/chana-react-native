import { Icon } from "@/components/ui/icon";
import {
  ContainerSizes,
  Radius,
  type ContainerSize,
  type RadiusKey,
} from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Image, type ImageSource } from "expo-image";
import { StyleSheet, View } from "react-native";

export type ThumbnailProps = {
  /** Shows a placeholder icon when missing */
  src?: string | ImageSource;
  /** Height; the width follows from `aspectRatio` */
  size?: ContainerSize;
  /** Width / height, e.g. 5 / 4 for a slightly wide image */
  aspectRatio?: number;
  radius?: RadiusKey;
};

/** Small rectangular image, e.g. the photo of a place in a list row */
export function Thumbnail({
  src,
  size = "l",
  aspectRatio = 5 / 4,
  radius = "sm",
}: ThumbnailProps) {
  const theme = useTheme();
  const height = ContainerSizes[size];

  return (
    <View
      style={[
        styles.container,
        {
          height,
          width: height * aspectRatio,
          borderRadius: Radius[radius],
          backgroundColor: theme.bg3,
        },
      ]}
    >
      {src ? (
        <Image
          source={src}
          contentFit="cover"
          transition={200}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <Icon icon="photo.slash" themeColor="fg3" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderCurve: "continuous",
  },
});
