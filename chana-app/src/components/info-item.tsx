import { ThemedText } from "@/components/themed-text";
import { View } from "react-native";

export type InfoItemProps = {
  label: string;
  value: string;
};

/** A labelled value, e.g. "Distance / 1.2 km" in a horizontal List */
export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <View>
      <ThemedText type="heading_4" themeColor="fg2">
        {label}
      </ThemedText>
      <ThemedText type="sublabel">{value}</ThemedText>
    </View>
  );
}
