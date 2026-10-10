import { Icon } from "@/components/ui/icon";
import { ThemedPressable } from "@/components/ui/themed-pressable";
import { ThemedText } from "@/components/ui/themed-text";
import { ContainerSizes, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatDate, isSameDay } from "@/utils/dates";
import { HapticStyles } from "@/utils/haptics";
import { useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

const DAYS_IN_WEEK = 7;
const MONTHS_IN_YEAR = 12;
// Months per row in the year view
const MONTH_COLUMNS = 3;
// Every month gets room for six weeks, so nothing below jumps between months
const WEEKS = 6;
const DAY_SIZE = ContainerSizes.s;
const DOT_SIZE = 4;
const DOT_GAP = Spacing.half;
const ROW_HEIGHT = DAY_SIZE + DOT_GAP + DOT_SIZE + Spacing.one;

/** How much time the calendar shows at once */
export type CalendarView = "day" | "week" | "month" | "year";

export type CalendarProps = {
  /** The selected day */
  value: Date;
  onChange: (date: Date) => void;
  /**
   * day: only the selected day's name; week: its week; month: its month's
   * grid (the default); year: the twelve months. The arrows step by that much
   */
  view?: CalendarView;
  /** Called when a month is tapped in the year view, to open that month */
  onViewChange?: (view: CalendarView) => void;
  /** Days with something on them get a dot */
  markedDates?: Date[];
  /** Days before / after these can't be picked */
  minimumDate?: Date;
  maximumDate?: Date;
  style?: StyleProp<ViewStyle>;
};

/**
 * Calendar to pick a day, with a dot under marked days, as a day, week, month
 * or year view. Drawn by the app: the platform's date picker can't mark days
 * (and ignores the accent color in Expo Go)
 */
export function Calendar({
  value,
  onChange,
  view = "month",
  onViewChange,
  markedDates = [],
  minimumDate,
  maximumDate,
  style,
}: CalendarProps) {
  // The month on show in the month view, and its year in the year view.
  // Their arrows only move this; the selected day stays
  const [cursor, setCursor] = useState(() => startOfMonth(value));
  // A newly selected day brings its month back on show
  const [shownFor, setShownFor] = useState(value);
  if (!isSameDay(shownFor, value)) {
    setShownFor(value);
    setCursor(startOfMonth(value));
  }

  const today = new Date();
  const markedDays = new Set(markedDates.map(dayKey));
  const markedMonths = new Set(markedDates.map(monthKey));
  const firstWeekday = getFirstWeekday();

  const isDisabled = (date: Date) =>
    (minimumDate !== undefined && endOfDay(date) < minimumDate) ||
    (maximumDate !== undefined && startOfDay(date) > maximumDate);
  // A month can be opened if any of its days can be picked
  const isMonthDisabled = (month: Date) =>
    (minimumDate !== undefined && addMonths(month, 1) <= minimumDate) ||
    (maximumDate !== undefined && month > maximumDate);

  // What the arrows do, and the title between them, depend on the view
  const weekStart = addDays(
    value,
    -((value.getDay() - firstWeekday + DAYS_IN_WEEK) % DAYS_IN_WEEK),
  );
  const steps = {
    day: {
      title: value.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      unit: "day",
      back: addDays(value, -1),
      forward: addDays(value, 1),
      disabled: isDisabled,
      go: onChange,
    },
    week: {
      title: `${weekStart.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
      })} – ${formatDate(addDays(weekStart, DAYS_IN_WEEK - 1))}`,
      unit: "week",
      back: addDays(value, -DAYS_IN_WEEK),
      forward: addDays(value, DAYS_IN_WEEK),
      disabled: isDisabled,
      go: onChange,
    },
    month: {
      title: cursor.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      }),
      unit: "month",
      back: addMonths(cursor, -1),
      forward: addMonths(cursor, 1),
      disabled: isMonthDisabled,
      go: setCursor,
    },
    year: {
      title: String(cursor.getFullYear()),
      unit: "year",
      back: addMonths(cursor, -MONTHS_IN_YEAR),
      forward: addMonths(cursor, MONTHS_IN_YEAR),
      // The same month a year on may be out of range while the year isn't
      disabled: (month: Date) =>
        (minimumDate !== undefined &&
          month.getFullYear() < minimumDate.getFullYear()) ||
        (maximumDate !== undefined &&
          month.getFullYear() > maximumDate.getFullYear()),
      go: setCursor,
    },
  }[view];

  const renderDay = (date: Date, key: number) => (
    <CalendarCell
      key={key}
      label={String(date.getDate())}
      accessibilityLabel={date.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}
      selected={isSameDay(date, value)}
      current={isSameDay(date, today)}
      marked={markedDays.has(dayKey(date))}
      disabled={isDisabled(date)}
      onPress={() => onChange(date)}
    />
  );

  return (
    <View style={style}>
      <View style={styles.header}>
        <ThemedText
          type="label"
          numberOfLines={1}
          accessibilityRole="header"
          style={styles.title}
        >
          {steps.title}
        </ThemedText>
        <View style={styles.arrows}>
          <ThemedPressable
            onPress={() => steps.go(steps.back)}
            disabled={steps.disabled(steps.back)}
            hitSlop={Spacing.two}
            accessibilityLabel={`Previous ${steps.unit}`}
            style={styles.arrow}
          >
            <Icon icon="chevron.left" themeColor="acc1" />
          </ThemedPressable>
          <ThemedPressable
            onPress={() => steps.go(steps.forward)}
            disabled={steps.disabled(steps.forward)}
            hitSlop={Spacing.two}
            accessibilityLabel={`Next ${steps.unit}`}
            style={styles.arrow}
          >
            <Icon icon="chevron.right" themeColor="acc1" />
          </ThemedPressable>
        </View>
      </View>

      {view === "week" || view === "month" ? (
        <View style={styles.row}>
          {Array.from({ length: DAYS_IN_WEEK }, (_, index) => (
            <ThemedText
              key={index}
              type="subtext"
              themeColor="fg3"
              style={styles.weekday}
            >
              {weekdayName((firstWeekday + index) % DAYS_IN_WEEK)}
            </ThemedText>
          ))}
        </View>
      ) : null}

      {view === "week" ? (
        <View style={styles.row}>
          {Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
            renderDay(addDays(weekStart, index), index),
          )}
        </View>
      ) : null}

      {view === "month" ? (
        <View style={styles.weeks}>
          {weeksOfMonth(cursor, firstWeekday).map((week, index) => (
            <View key={index} style={styles.row}>
              {/* Days outside the month are left empty, so the rest keep their columns */}
              {week.map((date, column) =>
                date ? (
                  renderDay(date, column)
                ) : (
                  <View key={column} style={styles.cell} />
                ),
              )}
            </View>
          ))}
        </View>
      ) : null}

      {view === "year"
        ? Array.from(
            { length: MONTHS_IN_YEAR / MONTH_COLUMNS },
            (_, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {Array.from({ length: MONTH_COLUMNS }, (__, column) => {
                  const month = new Date(
                    cursor.getFullYear(),
                    rowIndex * MONTH_COLUMNS + column,
                    1,
                  );

                  return (
                    <CalendarCell
                      key={column}
                      wide
                      label={month.toLocaleDateString(undefined, {
                        month: "short",
                      })}
                      accessibilityLabel={month.toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                      selected={monthKey(month) === monthKey(value)}
                      current={monthKey(month) === monthKey(today)}
                      marked={markedMonths.has(monthKey(month))}
                      disabled={isMonthDisabled(month)}
                      onPress={() => {
                        setCursor(month);
                        onViewChange?.("month");
                      }}
                    />
                  );
                })}
              </View>
            ),
          )
        : null}
    </View>
  );
}

type CalendarCellProps = {
  label: string;
  accessibilityLabel: string;
  /** Filled: the selected day, or the month it's in */
  selected: boolean;
  /** In the accent color: today, or this month */
  current: boolean;
  /** Has entries: gets a dot */
  marked: boolean;
  disabled: boolean;
  /** A pill instead of a circle, for month names */
  wide?: boolean;
  onPress: () => void;
};

/** One day (or one month in the year view) with the dot under it */
function CalendarCell({
  label,
  accessibilityLabel,
  selected,
  current,
  marked,
  disabled,
  wide = false,
  onPress,
}: CalendarCellProps) {
  const theme = useTheme();

  return (
    <ThemedPressable
      onPress={onPress}
      disabled={disabled}
      haptic={HapticStyles.select}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={marked ? "Has entries" : undefined}
      accessibilityState={{ selected, disabled }}
      style={styles.cell}
    >
      <View
        style={[
          styles.day,
          wide && styles.month,
          selected && { backgroundColor: theme.acc1 },
        ]}
      >
        <ThemedText
          type={selected ? "label" : "text"}
          themeColor={selected ? "constWhite" : current ? "acc1" : "fg1"}
        >
          {label}
        </ThemedText>
      </View>
      <View style={[styles.dot, marked && { backgroundColor: theme.fg3 }]} />
    </ThemedPressable>
  );
}

/** The month's days in rows of a week; null where a day belongs to another month */
function weeksOfMonth(month: Date, firstWeekday: number) {
  // Empty cells before the 1st, so it lands under its weekday
  const offset = (month.getDay() - firstWeekday + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const dayCount = addDays(addMonths(month, 1), -1).getDate();
  const weekCount = Math.ceil((offset + dayCount) / DAYS_IN_WEEK);

  return Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: DAYS_IN_WEEK }, (__, column) => {
      const day = week * DAYS_IN_WEEK + column - offset + 1;
      return day >= 1 && day <= dayCount
        ? new Date(month.getFullYear(), month.getMonth(), day)
        : null;
    }),
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(month: Date, count: number) {
  return new Date(month.getFullYear(), month.getMonth() + count, 1);
}

/** The same time of day, that many days on */
function addDays(date: Date, count: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

/** Same for every moment of one calendar day */
function dayKey(date: Date) {
  return `${monthKey(date)}-${date.getDate()}`;
}

/** Same for every moment of one month */
function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

/** "MON" for 1; 0 = Sunday, like Date.getDay() */
function weekdayName(weekday: number) {
  // 4 Jan 1970 was a Sunday
  return new Date(1970, 0, 4 + weekday)
    .toLocaleDateString(undefined, { weekday: "short" })
    .toUpperCase();
}

/** The weekday a week starts on in the device's region; 0 = Sunday */
function getFirstWeekday() {
  try {
    const locale = new Intl.Locale(
      Intl.DateTimeFormat().resolvedOptions().locale,
    ) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const firstDay = (locale.getWeekInfo?.() ?? locale.weekInfo)?.firstDay;
    // Intl counts Monday = 1 … Sunday = 7
    if (firstDay) return firstDay % DAYS_IN_WEEK;
  } catch {
    // No week info on this engine
  }
  // Monday, the international standard
  return 1;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  title: {
    flexShrink: 1,
  },
  arrows: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  arrow: {
    padding: Spacing.one,
  },
  row: {
    flexDirection: "row",
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    paddingVertical: Spacing.one,
  },
  weeks: {
    minHeight: ROW_HEIGHT * WEEKS,
  },
  cell: {
    flex: 1,
    height: ROW_HEIGHT,
    alignItems: "center",
    gap: DOT_GAP,
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  month: {
    width: undefined,
    paddingHorizontal: Spacing.three,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Radius.full,
  },
});
