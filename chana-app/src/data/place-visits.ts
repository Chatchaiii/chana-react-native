import { PLACEHOLDER_PLACES } from "@/data/places";
import type { Place } from "@/types/place";
import { useSyncExternalStore } from "react";

export type PlaceVisit = {
  visited: boolean;
  /** When the user was there; only meaningful while `visited` */
  visitedOn: Date;
};

// TODO: save visits once places come from real data; for now they live in memory
const visits = new Map<string, PlaceVisit>();
export type VisitedPlace = { place: Place; visitedOn: Date };

// The snapshot of useVisitedPlaces; rebuilt after a visit changes
let visitedPlaces: VisitedPlace[] | null = null;
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

function getVisitedPlaces(): VisitedPlace[] {
  // TODO: load the places from real data
  visitedPlaces ??= PLACEHOLDER_PLACES.map((place) => ({
    place,
    visit: getVisit(place),
  }))
    .filter(({ visit }) => visit.visited)
    .map(({ place, visit }) => ({ place, visitedOn: visit.visitedOn }));
  return visitedPlaces;
}

/** Every visited place with the day it was visited, e.g. for the calendar */
export function useVisitedPlaces(): VisitedPlace[] {
  return useSyncExternalStore(subscribe, getVisitedPlaces);
}

export function setPlaceVisit(placeId: string, visit: PlaceVisit) {
  visits.set(placeId, visit);
  visitedPlaces = null;
  listeners.forEach((listener) => listener());
}
