import type { CalendarEvent } from "@/types/event";
import { daysFromNow } from "@/utils/dates";
import { useSyncExternalStore } from "react";

/** Stand-in content until events come from real data */
const PLACEHOLDER_EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Movie night", date: daysFromNow(0), author: "hanshine" },
  {
    id: "e2",
    title: "Dinner at Noodle House",
    date: daysFromNow(3),
    author: "chadchai",
  },
];

// TODO: save events once they come from real data; for now they live in memory.
// Replaced (never mutated) on every change, so it works as a store snapshot
let events = PLACEHOLDER_EVENTS;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setEvents(next: CalendarEvent[]) {
  events = next;
  listeners.forEach((listener) => listener());
}

/** All events, updated live as they're added or deleted */
export function useEvents(): CalendarEvent[] {
  return useSyncExternalStore(subscribe, () => events);
}

export function addEvent(title: string, date: Date, author: string) {
  setEvents([
    ...events,
    { id: `e${Date.now()}`, title: title.trim(), date, author },
  ]);
}

export function deleteEvent(id: string) {
  setEvents(events.filter((event) => event.id !== id));
}
