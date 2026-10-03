import {
  Calendar04Icon,
  Home01Icon,
  MapIcon,
  SparkleIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react-native";
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
  icon: IconSvgElement;
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
    icon: Home01Icon,
    searchTitle: "Posts",
    create: { label: "New post", href: "/new" },
    profileHref: "/profile",
  },
  places: {
    route: "places",
    title: "Places",
    icon: MapIcon,
    searchTitle: "Places",
    create: { label: "New place", href: "/places/new" },
    profileHref: "/places/profile",
  },
  wishes: {
    route: "wishes",
    title: "Wishes",
    icon: SparkleIcon,
    searchTitle: "Wishes",
    create: { label: "New wish", href: "/wishes/new" },
    profileHref: "/wishes/profile",
  },
  calendar: {
    route: "calendar",
    title: "Calendar",
    icon: Calendar04Icon,
    searchTitle: "Events",
    create: { label: "New event", href: "/calendar/new" },
    profileHref: "/calendar/profile",
  },
} satisfies Record<string, Tab>;
