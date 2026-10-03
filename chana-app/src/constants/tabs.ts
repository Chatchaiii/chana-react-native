import type { Href } from "expo-router";

export type CreateAction = {
  label: string;
  href: Href;
};

export type Tab = {
  /** Drawer route name (folder in src/app) */
  route: string;
  /** Drawer label */
  title: string;
  /** Heading of this tab's group in the global search results */
  searchTitle: string;
  /** What the create button opens on this tab */
  create: CreateAction;
};

/**
 * Every drawer tab, in menu order. Used for the drawer labels, the grouping of
 * the global search results, and the route the create button opens on that tab.
 */
export const Tabs = {
  home: {
    route: "(main)",
    title: "Home",
    searchTitle: "Posts",
    create: { label: "New post", href: "/new" },
  },
  places: {
    route: "places",
    title: "Places",
    searchTitle: "Places",
    create: { label: "New place", href: "/places/new" },
  },
  wishes: {
    route: "wishes",
    title: "Wishes",
    searchTitle: "Wishes",
    create: { label: "New wish", href: "/wishes/new" },
  },
  calendar: {
    route: "calendar",
    title: "Calendar",
    searchTitle: "Events",
    create: { label: "New event", href: "/calendar/new" },
  },
} satisfies Record<string, Tab>;
