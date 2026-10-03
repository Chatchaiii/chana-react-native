import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

/** Colors of the current light or dark palette */
export function useTheme() {
  const scheme = useColorScheme();
  return Colors[scheme === "dark" ? "dark" : "light"];
}
