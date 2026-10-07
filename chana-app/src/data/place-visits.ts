import type { Place } from "@/types/place";
import { useSyncExternalStore } from "react";

export type PlaceVisit = {
  visited: boolean;
  /** When the user was there; only meaningful while `visited` */
  visitedOn: Date;
};

// TODO: save visits once places come from real data; for now they live in memory
const visits = new Map<string, PlaceVisit>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The stored visit, seeded from the place's data the first time it's read */
function getVisit(place: Place): PlaceVisit {
  let visit = visits.get(place.id);
  if (!visit) {
    visit = {
      visited: place.visited ?? false,
      visitedOn: place.visitedOn ?? new Date(),
    };
    visits.set(place.id, visit);
  }
  return visit;
}

/** A place's visited state, shared by every screen that shows the place */
export function usePlaceVisit(place: Place): PlaceVisit {
  return useSyncExternalStore(subscribe, () => getVisit(place));
}

export function setPlaceVisit(placeId: string, visit: PlaceVisit) {
  visits.set(placeId, visit);
  listeners.forEach((listener) => listener());
}
