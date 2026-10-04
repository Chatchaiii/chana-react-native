import { ActionRow } from "@/components/action-row";
import { List } from "@/components/list";
import { ThemedText } from "@/components/themed-text";
import { PLACEHOLDER_POSTS } from "@/constants/placeholder-posts";
import { Spacing } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

/** Sheet with the options for one post, opened from its "…" button */
export default function PostOptions() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const post = PLACEHOLDER_POSTS.find((item) => item.id === id);

  // TODO: implement each action for `post`; for now they just close the sheet
  const close = () => router.back();

  return (
    // The sheet already floats above the home indicator, so no safe-area padding
    <View style={styles.container}>
      {post && (
        <ThemedText type="heading_4" themeColor="fg2" style={styles.title}>
          Post by {post.author}
        </ThemedText>
      )}

      <List type="card" separatorPadding="three">
        <ActionRow icon="square.and.arrow.up" label="Share" onPress={close} />
        <ActionRow icon="link" label="Copy link" onPress={close} />
        <ActionRow icon="bookmark" label="Save" onPress={close} />
      </List>

      <List type="card" separatorPadding="three">
        <ActionRow icon="trash" label="Delete" destructive onPress={close} />
      </List>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.five,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  title: {
    paddingHorizontal: Spacing.two,
  },
});
