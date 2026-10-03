import { ScreenScrollView } from "@/components/screen-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export type SearchResultsProps = {
  query: string;
};

/** Search results across every tab, grouped by tab. */
export function SearchResults({ query }: SearchResultsProps) {
  return (
    <ScreenScrollView
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.container}
    >
      {Object.values(Tabs).map((tab) => (
        <View key={tab.route} style={styles.section}>
          <ThemedText type="label" themeColor="fg2">
            {tab.searchTitle}
          </ThemedText>
          {/* TODO: query this tab's data */}
          <ThemedText themeColor="fg3">No results for “{query}”</ThemedText>
        </View>
      ))}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  section: {
    gap: Spacing.one,
  },
});
