/** A calendar entry added by hand (not a post or a place visit) */
export type CalendarEvent = {
  id: string;
  title: string;
  /** The day it's on; the time of day isn't used */
  date: Date;
  /** Who added the event */
  author: string;
};
