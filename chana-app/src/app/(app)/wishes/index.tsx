import { EmptyState } from "@/components/empty-state";
import { FilterButton } from "@/components/filter-button";
import { List } from "@/components/list";
import { ScreenScrollView } from "@/components/screen-scroll-view";
import { TabScreen } from "@/components/tab-screen";
import { WishItem, WishItemSeparatorInset } from "@/components/wish-item";
import type { IconName } from "@/constants/icons.generated";
import { Tabs } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { useSession } from "@/data/session";
import { useWishes } from "@/data/wishes";
import type { Wish } from "@/types/wish";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

type Status = "all" | "completed";

// A wish checked or unchecked stays this long before it leaves its list, so
// it doesn't vanish under the finger and the tap can still be undone
const TOGGLE_LINGER = 5000;

/** The main filters, as tiles at the top */
const STATUS_FILTERS: { status: Status; label: string; icon: IconName }[] = [
  { status: "all", label: "All", icon: "tray" },
  { status: "completed", label: "Completed", icon: "checkmark" },
];

/** "All" is what's still open; done wishes move to "Completed" */
function hasStatus(wish: Wish, status: Status) {
  return status === "completed" ? wish.completed : !wish.completed;
}

/** How long a just-toggled wish still lingers in the list it left, in ms (0 = gone) */
function lingerLeft(wish: Wish, now: number) {
  if (!wish.toggledAt) return 0;
  return Math.max(0, wish.toggledAt.getTime() + TOGGLE_LINGER - now);
}

export default function Wishes() {
  const wishes = useWishes();
  const me = useSession()?.name;
  const [status, setStatus] = useState<Status>("all");
  // null = everyone's wishes
  const [author, setAuthor] = useState<string | null>(null);
  // The time the lingering wishes are measured against; moved on by the timer
  const [now, setNow] = useState(() => Date.now());

  // Re-renders when the next lingering wish runs out, so it leaves "All"
  useEffect(() => {
    const left = wishes
      .map((wish) => lingerLeft(wish, Date.now()))
      .filter((ms) => ms > 0);
    if (left.length === 0) return;
    const timer = setTimeout(() => setNow(Date.now()), Math.min(...left));
    return () => clearTimeout(timer);
  }, [wishes, now]);

  // Everyone who added a wish, yourself first
  // TODO: the couple's two members, once there's a partner in the data
  const authors = [...new Set(wishes.map((wish) => wish.author))].sort(
    (a, b) => Number(b === me) - Number(a === me) || a.localeCompare(b),
  );

  // Each row's counts take the other row's filter into account
  const ofAuthor = author
    ? wishes.filter((wish) => wish.author === author)
    : wishes;
  const withStatus = wishes.filter((wish) => hasStatus(wish, status));
  // Counts change at once; the list keeps just-toggled wishes a moment
  const shown = ofAuthor.filter(
    (wish) => hasStatus(wish, status) || lingerLeft(wish, now) > 0,
  );

  const emptyText =
    status === "completed"
      ? `No completed wishes${author ? ` from ${author}` : ""} yet.`
      : `No open wishes${author ? ` from ${author}` : ""}.`;

  return (
    <TabScreen tab={Tabs.wishes}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        // Taps on the ⓘ button work while the keyboard is up; taps elsewhere close it
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <View style={styles.row} accessibilityRole="tablist">
          {STATUS_FILTERS.map((filter) => (
            <FilterButton
              key={filter.status}
              label={filter.label}
              icon={filter.icon}
              count={
                ofAuthor.filter((wish) => hasStatus(wish, filter.status)).length
              }
              active={status === filter.status}
              onPress={() => setStatus(filter.status)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.chips} accessibilityRole="tablist">
            <FilterButton
              variant="chip"
              label="Everyone"
              count={withStatus.length}
              active={author === null}
              onPress={() => setAuthor(null)}
            />
            {authors.map((name) => (
              <FilterButton
                key={name}
                variant="chip"
                label={name}
                count={withStatus.filter((wish) => wish.author === name).length}
                active={author === name}
                onPress={() => setAuthor(name)}
              />
            ))}
          </View>

          {shown.length > 0 ? (
            <List type="card" separatorInsetLeading={WishItemSeparatorInset}>
              {shown.map((wish) => (
                <WishItem key={wish.id} wish={wish} />
              ))}
            </List>
          ) : (
            <EmptyState>{emptyText}</EmptyState>
          )}
        </View>
      </ScreenScrollView>
    </TabScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.three,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
});
