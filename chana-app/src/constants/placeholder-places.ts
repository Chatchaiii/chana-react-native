import type { Place } from "@/components/place-item";

/** Stand-in content until places come from real data */
export const PLACEHOLDER_PLACES: Place[] = [
  {
    id: "1",
    name: "Aroma",
    description:
      "Small coffee bar with great flat whites and a quiet corner to read.",
    author: "chadchai",
    distance: "4 km",
    rating: 4,
    image: "https://picsum.photos/seed/chana-place-1/600/480",
  },
  {
    id: "2",
    name: "Stadtpark",
    description: "Big park with a pond, perfect for a picnic on sunny days.",
    author: "chadchai",
    distance: "1.2 km",
    rating: 5,
    image: "https://picsum.photos/seed/chana-place-2/600/480",
  },
  {
    id: "3",
    name: "Noodle House",
    description: "Hand-pulled noodles. Usually busy around lunch.",
    author: "chadchai",
    distance: "800 m",
    rating: 2,
  },
];
