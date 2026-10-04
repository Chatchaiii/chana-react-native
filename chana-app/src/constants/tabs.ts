import type { IconName } from "@/constants/icons.generated";
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
  /** Drawer icon */
  icon: IconName;
  /** Drawer icon while this tab is the active route */
  activeIcon: IconName;
  /** Heading of this tab's group in the global search results */
  searchTitle: string;
  /** What the create button opens on this tab */
  create: CreateAction;
  /** The profile sheet, opened from the header avatar */
  profileHref: Href;
};

/**
 * Every drawer tab, in menu order. Used for the drawer items (label + icon), the
 * grouping of the global search results, and the route the create button opens
 * on that tab.
 */
export const Tabs = {
  home: {
    route: "(main)",
    title: "Home",
    icon: "home",
    activeIcon: "home.fill",
    searchTitle: "Posts",
    create: { label: "New post", href: "/new" },
    profileHref: "/profile",
  },
  places: {
    route: "places",
    title: "Places",
    icon: "map",
    activeIcon: "map.fill",
    searchTitle: "Places",
    create: { label: "New place", href: "/places/new" },
    profileHref: "/places/profile",
  },
  wishes: {
    route: "wishes",
    title: "Wishes",
    icon: "sparkle",
    activeIcon: "sparkle.fill",
    searchTitle: "Wishes",
    create: { label: "New wish", href: "/wishes/new" },
    profileHref: "/wishes/profile",
  },
  calendar: {
    route: "calendar",
    title: "Calendar",
    icon: "calendar",
    activeIcon: "calendar.fill",
    searchTitle: "Events",
    create: { label: "New event", href: "/calendar/new" },
    profileHref: "/calendar/profile",
  },
} satisfies Record<string, Tab>;
