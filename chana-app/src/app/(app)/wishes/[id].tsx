import { Button } from "@/components/ui/button";
import { CheckItem } from "@/components/ui/check-item";
import { List } from "@/components/ui/list";
import { SheetContent } from "@/components/layout/sheet-content";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedTextInput } from "@/components/ui/themed-text-input";
import { Spacing } from "@/constants/theme";
import { setWishCompleted, updateWish, useWish } from "@/data/wishes";
import { formatDate } from "@/utils/dates";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet } from "react-native";

// Room for a few lines of notes before the field grows
const NOTES_MIN_HEIGHT = 88;

/** Sheet with a wish's details, opened from its ⓘ button. Edits save as you type */
export default function WishDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const wish = useWish(id);

  if (!wish) return null;

  return (
    <SheetContent>
      <ThemedText type="heading_4" themeColor="fg2" style={styles.caption}>
        Added by {wish.author}
      </ThemedText>

      <List type="card">
        <ThemedTextInput
          type="label"
          value={wish.name}
          onChangeText={(name) => updateWish(wish.id, { name })}
          placeholder="Title"
          accessibilityLabel="Title"
          style={styles.field}
        />
        <ThemedTextInput
          value={wish.description}
          onChangeText={(description) => updateWish(wish.id, { description })}
          placeholder="Notes"
          multiline
          accessibilityLabel="Notes"
          style={[styles.field, styles.notes]}
        />
      </List>

      <List type="card">
        <CheckItem
          checked={wish.completed}
          onPress={() => setWishCompleted(wish.id, !wish.completed)}
          label="Completed"
          sublabel={
            wish.completed && wish.completedAt
              ? formatDate(wish.completedAt)
              : "Not yet"
          }
        />
      </List>

      <Button
        label="Done"
        type="primary"
        size="medium_2"
        radius="md"
        fullWidth
        onPress={() => router.back()}
      />
    </SheetContent>
  );
}

const styles = StyleSheet.create({
  caption: {
    paddingHorizontal: Spacing.two,
  },
  field: {
    padding: Spacing.three,
  },
  notes: {
    minHeight: NOTES_MIN_HEIGHT,
  },
});
