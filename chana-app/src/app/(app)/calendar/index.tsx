import { ScreenScrollView } from "@/components/layout/screen-scroll-view";
import { TabScreen } from "@/components/layout/tab-screen";
import { PlaceItem } from "@/components/places/place-item";
import { Avatar } from "@/components/ui/avatar";
import {
  Calendar as CalendarPicker,
  type CalendarView,
} from "@/components/ui/calendar";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterButton } from "@/components/ui/filter-button";
import { List } from "@/components/ui/list";
import { ListItem } from "@/components/ui/list-item";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { Tabs, type CreatableTab } from "@/constants/tabs";
import { Radius, Spacing } from "@/constants/theme";
import { deleteEvent, useEvents } from "@/data/events";
import { useVisitedPlaces } from "@/data/place-visits";
import { PLACEHOLDER_POSTS } from "@/data/posts";
import { useDetailRoutes } from "@/hooks/use-detail-routes";
import type { CalendarEvent } from "@/types/event";
import type { Post } from "@/types/post";
import { formatDate, isSameDay } from "@/utils/dates";
import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Alert, StyleSheet, View } from "react-native";

/** What the calendar gathers: its own events, and dated items of other tabs */
type Kind = "events" | "posts" | "places";

const KINDS: { kind: Kind; label: string }[] = [
  { kind: "events", label: "Events" },
  { kind: "posts", label: "Posts" },
  { kind: "places", label: "Places" },
];

/** How much of the calendar is on show; the lists are always the picked day's */
const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function Calendar() {
  const [day, setDay] = useState(() => new Date());
  const [view, setView] = useState<CalendarView>("month");
  // The kinds whose list is shown; all of them to begin with
  const [shown, setShown] = useState<Kind[]>(["events", "posts", "places"]);

  const allEvents = useEvents();
  // TODO: load the posts from real data
  const allPosts = PLACEHOLDER_POSTS;
  const allPlaces = useVisitedPlaces();

  // Everything dated on the picked day
  const events = allEvents.filter((event) => isSameDay(event.date, day));
  const posts = allPosts.filter((post) => isSameDay(post.postedAt, day));
  const places = allPlaces.filter(({ visitedOn }) => isSameDay(visitedOn, day));
  const counts = {
    events: events.length,
    posts: posts.length,
    places: places.length,
  };

  const toggle = (kind: Kind) =>
    setShown((current) =>
      current.includes(kind)
        ? current.filter((item) => item !== kind)
        : [...current, kind],
    );
  const visible = (kind: Kind) => shown.includes(kind) && counts[kind] > 0;

  // The days that get a dot: every date of the kinds that are switched on
  const markedDates = [
    ...(shown.includes("events") ? allEvents.map((event) => event.date) : []),
    ...(shown.includes("posts") ? allPosts.map((post) => post.postedAt) : []),
    ...(shown.includes("places")
      ? allPlaces.map(({ visitedOn }) => visitedOn)
      : []),
  ];

  // The create button adds the event on the picked day
  const tab: CreatableTab = {
    ...Tabs.calendar,
    create: {
      ...Tabs.calendar.create,
      href: { pathname: "/calendar/new", params: { date: day.toISOString() } },
    },
  };

  return (
    <TabScreen tab={tab}>
      <ScreenScrollView contentContainerStyle={styles.content}>
        <View style={styles.calendar}>
          <SegmentedControl options={VIEWS} value={view} onChange={setView} />
          <ThemedView themeColor="bg1" style={styles.card}>
            <CalendarPicker
              value={day}
              onChange={setDay}
              view={view}
              onViewChange={setView}
              markedDates={markedDates}
            />
          </ThemedView>
        </View>

        <View style={styles.day}>
          {/* The day view already names the day in its header */}
          {view === "day" ? null : (
            <ThemedText
              type="heading_4"
              themeColor="fg2"
              style={styles.heading}
            >
              {formatDate(day)}
            </ThemedText>
          )}
          <View style={styles.filters}>
            {KINDS.map(({ kind, label }) => (
              <FilterButton
                key={kind}
                variant="chip"
                label={label}
                count={counts[kind]}
                active={shown.includes(kind)}
                onPress={() => toggle(kind)}
                // Each one switches its own list on and off
                accessibilityRole="switch"
                accessibilityState={{ checked: shown.includes(kind) }}
              />
            ))}
          </View>

          {visible("events") ? (
            <Section title="Events">
              {events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </Section>
          ) : null}

          {visible("posts") ? (
            <Section title="Posts">
              {posts.map((post) => (
                <PostRow key={post.id} post={post} />
              ))}
            </Section>
          ) : null}

          {visible("places") ? (
            <Section title="Places visited">
              {places.map(({ place }) => (
                <PlaceItem key={place.id} place={place} />
              ))}
            </Section>
          ) : null}

          {KINDS.some(({ kind }) => visible(kind)) ? null : (
            <EmptyState>{`Nothing on ${formatDate(day)}.`}</EmptyState>
          )}
        </View>
      </ScreenScrollView>
    </TabScreen>
  );
}

/** One kind's list of the day, under its heading */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="heading_4" themeColor="fg2" style={styles.heading}>
        {title}
      </ThemedText>
      <List type="card">{children}</List>
    </View>
  );
}

/** An event of the day; its "…" button offers to delete it */
function EventItem({ event }: { event: CalendarEvent }) {
  return (
    <ListItem
      leading={<Avatar name={event.author} size="m" />}
      label={event.title}
      sublabel={`Added by ${event.author}`}
      onOptionsPress={() =>
        Alert.alert(event.title, undefined, [
          {
            text: "Delete event",
            style: "destructive",
            onPress: () => deleteEvent(event.id),
          },
          { text: "Cancel", style: "cancel" },
        ])
      }
    />
  );
}

/** A post of the day in one line; opens the post */
function PostRow({ post }: { post: Post }) {
  const router = useRouter();
  const routes = useDetailRoutes();

  return (
    <ListItem
      leading={<Avatar name={post.author} size="m" />}
      label={post.title}
      sublabel={post.text}
      sublabelLines={1}
      onPress={() => router.push(routes.post(post.id))}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
  },
  calendar: {
    gap: Spacing.two,
  },
  card: {
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  day: {
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.two,
  },
  heading: {
    paddingHorizontal: Spacing.two,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
});
