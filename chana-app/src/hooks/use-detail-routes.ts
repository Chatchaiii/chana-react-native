import { useSegments, type Href } from "expo-router";

/**
 * Where a post or place (and their sheets) opens from the current screen.
 * The Calendar tab has its own copies of those pages (`calendar/post/[id]`,
 * `calendar/places/[id]`), so opening one there stays in the tab and Back
 * returns to the calendar; everywhere else they open in their own tab
 */
export function useDetailRoutes() {
  const inCalendar = (useSegments() as string[]).includes("calendar");

  return {
    post: (id: string): Href =>
      inCalendar
        ? { pathname: "/calendar/post/[id]", params: { id } }
        : { pathname: "/post/[id]", params: { id } },
    postOptions: (id: string): Href =>
      inCalendar
        ? { pathname: "/calendar/post/[id]/options", params: { id } }
        : { pathname: "/post/[id]/options", params: { id } },
    place: (id: string): Href =>
      inCalendar
        ? { pathname: "/calendar/places/[id]", params: { id } }
        : { pathname: "/places/[id]", params: { id } },
    placeVisitedDate: (id: string): Href =>
      inCalendar
        ? { pathname: "/calendar/places/[id]/visited-date", params: { id } }
        : { pathname: "/places/[id]/visited-date", params: { id } },
  };
}
