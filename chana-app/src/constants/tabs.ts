import type { IconName } from "@/constants/icons.generated";
import type { SpacingKey } from "@/constants/theme";
import type { Href } from "expo-router";

export type CreateAction = {
  label: string;
  href: Href;
};

export type Tab = {
  /** Route name (folder in src/app/(app)) */
  route: string;
  /** Where the tab's main page lives */
  href: Href;
  /** Label in the menu and the header */
  title: string;
  /** Icon in the menu */
  icon: IconName;
  /** Heading of this tab's group in the global search results; omit to leave it out of search */
  searchTitle?: string;
  /** What the create button opens on this tab; omit for no create button (and no `new.tsx`) */
  create?: CreateAction;
  /** The profile sheet, opened from the header avatar */
  profileHref: Href;
};

/** A tab with a create button (and a `new.tsx` route) */
export type CreatableTab = Tab & { create: CreateAction };

/**
 * Every tab. Used for the tabs' screens, the grouping of the global
 * search results, and the route the create button opens on that tab. The first
 * tab is the one the app opens on; the menu order is set by `MenuSections`.
 */
export const Tabs = {
  home: {
    route: "(home)",
    href: "/",
    title: "Home",
    icon: "home.fill",
    searchTitle: "Posts",
    create: { label: "New post", href: "/new" },
    profileHref: "/profile",
  },
  places: {
    route: "places",
    href: "/places",
    title: "Places",
    icon: "map.fill",
    searchTitle: "Places",
    create: { label: "New place", href: "/places/new" },
    profileHref: "/places/profile",
  },
  wishes: {
    route: "wishes",
    href: "/wishes",
    title: "Wishes",
    icon: "sparkle.fill",
    searchTitle: "Wishes",
    create: { label: "New wish", href: "/wishes/new" },
    profileHref: "/wishes/profile",
  },
  calendar: {
    route: "calendar",
    href: "/calendar",
    title: "Calendar",
    icon: "calendar.fill",
    searchTitle: "Events",
    create: { label: "New event", href: "/calendar/new" },
    profileHref: "/calendar/profile",
  },
  couple: {
    route: "couple",
    href: "/couple",
    title: "Couple",
    icon: "heart.fill",
    profileHref: "/couple/profile",
  },
  activity: {
    route: "activity",
    href: "/activity",
    title: "Activity",
    icon: "activity.fill",
    profileHref: "/activity/profile",
  },
  saved: {
    route: "saved",
    href: "/saved",
    title: "Saved",
    icon: "bookmark.fill",
    profileHref: "/saved/profile",
  },
} satisfies Record<string, Tab>;

export type MenuSection = {
  /** How the section is laid out in the menu (styles live in AppMenu) */
  variant: "list" | "row";
  /** Extra space above this section, on top of the menu's gap between sections */
  spaceBefore?: SpacingKey;
  tabs: Tab[];
};

/** The side menu, top to bottom */
export const MenuSections: MenuSection[] = [
  { variant: "row", tabs: [Tabs.activity, Tabs.saved] },
  { variant: "list", tabs: [Tabs.couple] },
  {
    variant: "list",
    spaceBefore: "five",
    tabs: [Tabs.home, Tabs.places, Tabs.wishes, Tabs.calendar],
  },
];
