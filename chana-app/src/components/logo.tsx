import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image, type ImageProps } from "expo-image";

const LogoLight = require("@/assets/images/icon-foreground-light.png");
const LogoDark = require("@/assets/images/icon-foreground-dark.png");

export type LogoProps = Omit<ImageProps, "source"> & {
  /** Width and height in points */
  size: number;
};

/** The Chana heart, in its light or dark version to match the color scheme */
export function Logo({ size, style, ...rest }: LogoProps) {
  const scheme = useColorScheme();

  return (
    <Image
      {...rest}
      source={scheme === "dark" ? LogoDark : LogoLight}
      contentFit="contain"
      accessibilityIgnoresInvertColors
      style={[{ width: size, height: size }, style]}
    />
  );
}
