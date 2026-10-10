import { CHECK_CIRCLE_SIZE, CheckCircle } from "@/components/check-circle";
import { FocusArea } from "@/components/focus-area";
import { ThemedIcon } from "@/components/themed-icon";
import { ThemedPressable } from "@/components/themed-pressable";
import { TextStyles, ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { Spacing } from "@/constants/theme";
import { setWishCompleted, updateWish } from "@/data/wishes";
import type { Wish } from "@/types/wish";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Keyboard, StyleSheet, View, type TextInput } from "react-native";

const ROW_PADDING = Spacing.three;
const GAP = Spacing.three;
const INFO_ICON_SIZE = 22;
// Centres the circle on the title's first line (the row is top-aligned, so
// a long title or the notes grow downwards)
const CIRCLE_OFFSET = (TextStyles.label.lineHeight - CHECK_CIRCLE_SIZE) / 2;

/** Where a WishItem's title starts: pass it as the List's `separatorInsetLeading` */
export const WishItemSeparatorInset = ROW_PADDING + CHECK_CIRCLE_SIZE + GAP;

export type WishItemProps = {
  wish: Wish;
};

/**
 * A wish as a Reminders-style row: tap the circle to complete it, tap the
 * title to edit it in place. While editing, an ⓘ button opens its details.
 */
export function WishItem({ wish }: WishItemProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const titleRef = useRef<TextInput>(null);

  const openDetails = () => {
    Keyboard.dismiss();
    router.push({ pathname: "/wishes/[id]", params: { id: wish.id } });
  };

  return (
    <View style={styles.row}>
      <ThemedPressable
        onPress={() => setWishCompleted(wish.id, !wish.completed)}
        // The circle is small; the whole column next to the title counts
        hitSlop={Spacing.two}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: wish.completed }}
        accessibilityLabel={`Completed: ${wish.name}`}
        style={styles.circle}
      >
        <CheckCircle checked={wish.completed} background="bg1" />
      </ThemedPressable>

      {/* Tapping the notes or the row's padding edits the title too */}
      <FocusArea
        inputRef={titleRef}
        hitSlop={{ top: ROW_PADDING, bottom: ROW_PADDING }}
        style={styles.text}
      >
        <ThemedTextInput
          ref={titleRef}
          type="label"
          // Completed wishes fade back, like checked reminders
          themeColor={wish.completed ? "fg2" : "fg1"}
          value={wish.name}
          onChangeText={(name) => updateWish(wish.id, { name })}
          placeholder="New wish"
          multiline
          // Return ends editing instead of adding a line break
          submitBehavior="blurAndSubmit"
          returnKeyType="done"
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          accessibilityLabel="Wish"
        />
        {wish.description ? (
          <ThemedText type="sublabel" themeColor="fg2" numberOfLines={2}>
            {wish.description}
          </ThemedText>
        ) : null}
      </FocusArea>

      {editing ? (
        <ThemedPressable
          onPress={openDetails}
          hitSlop={Spacing.two}
          accessibilityLabel="Details"
        >
          <ThemedIcon
            icon="info.circle"
            themeColor="acc1"
            size={INFO_ICON_SIZE}
          />
        </ThemedPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: ROW_PADDING,
    gap: GAP,
  },
  circle: {
    marginTop: CIRCLE_OFFSET,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
});
