import { Icon } from "@/components/ui/icon";
import { ThemedPressable } from "@/components/ui/themed-pressable";
import { ThemedText } from "@/components/ui/themed-text";
import { ContainerSizes, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { isSameDay } from "@/utils/dates";
import { HapticStyles } from "@/utils/haptics";
import { useState } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

const DAYS_IN_WEEK = 7;
// Every month gets room for six weeks, so nothing below jumps between months
const WEEKS = 6;
const DAY_SIZE = ContainerSizes.s;
const DOT_SIZE = 4;
const DOT_GAP = Spacing.half;
const WEEK_HEIGHT = DAY_SIZE + DOT_GAP + DOT_SIZE + Spacing.one;

export type CalendarProps = {
  /** The selected day */
  value: Date;
  onChange: (date: Date) => void;
  /** Days with something on them get a dot */
  markedDates?: Date[];
  /** Days before / after these can't be picked */
  minimumDate?: Date;
  maximumDate?: Date;
  style?: StyleProp<ViewStyle>;
};

/**
 * Month calendar to pick a day, with a dot under marked days. Drawn by the
 * app: the platform's date picker can't mark days (and ignores the accent
 * color in Expo Go)
 */
export function Calendar({
  value,
  onChange,
  markedDates = [],
  minimumDate,
  maximumDate,
  style,
}: CalendarProps) {
  const theme = useTheme();
  // The month on show (its first day); starts on the selected day's month
  const [month, setMonth] = useState(() => startOfMonth(value));
  const today = new Date();
  const marked = new Set(markedDates.map(dayKey));

  const firstWeekday = getFirstWeekday();
  // Empty cells before the 1st, so it lands under its weekday
  const offset = (month.getDay() - firstWeekday + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const dayCount = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
  ).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from(
      { length: dayCount },
      (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1),
    ),
  ];
  const weeks = Array.from(
    { length: Math.ceil(cells.length / DAYS_IN_WEEK) },
    (_, week) => cells.slice(week * DAYS_IN_WEEK, (week + 1) * DAYS_IN_WEEK),
  );

  const previous = addMonths(month, -1);
  const next = addMonths(month, 1);
  // A month can be opened if any of its days can be picked
  const canGoBack = !minimumDate || addMonths(previous, 1) > minimumDate;
  const canGoForward = !maximumDate || next <= maximumDate;
  const isDisabled = (date: Date) =>
    (minimumDate !== undefined && endOfDay(date) < minimumDate) ||
    (maximumDate !== undefined && startOfDay(date) > maximumDate);

  return (
    <View style={style}>
      <View style={styles.header}>
        <ThemedText type="label" accessibilityRole="header">
          {month.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </ThemedText>
        <View style={styles.arrows}>
          <ThemedPressable
            onPress={() => setMonth(previous)}
            disabled={!canGoBack}
            hitSlop={Spacing.two}
            accessibilityLabel="Previous month"
            style={styles.arrow}
          >
            <Icon icon="chevron.left" themeColor="acc1" />
          </ThemedPressable>
          <ThemedPressable
            onPress={() => setMonth(next)}
            disabled={!canGoForward}
            hitSlop={Spacing.two}
            accessibilityLabel="Next month"
            style={styles.arrow}
          >
            <Icon icon="chevron.right" themeColor="acc1" />
          </ThemedPressable>
        </View>
      </View>

      <View style={styles.week}>
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

      <View style={styles.weeks}>
        {weeks.map((week, index) => (
          <View key={index} style={styles.week}>
            {/* A short last week is filled up, so its days keep their columns */}
            {Array.from({ length: DAYS_IN_WEEK }, (_, column) => {
              const date = week[column];
              if (!date) return <View key={column} style={styles.cell} />;

              const selected = isSameDay(date, value);
              const disabled = isDisabled(date);

              return (
                <ThemedPressable
                  key={column}
                  onPress={() => onChange(date)}
                  disabled={disabled}
                  haptic={HapticStyles.select}
                  accessibilityLabel={date.toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  accessibilityHint={
                    marked.has(dayKey(date)) ? "Has entries" : undefined
                  }
                  accessibilityState={{ selected, disabled }}
                  style={styles.cell}
                >
                  <View
                    style={[
                      styles.day,
                      selected && { backgroundColor: theme.acc1 },
                    ]}
                  >
                    <ThemedText
                      type={selected ? "label" : "text"}
                      themeColor={
                        selected
                          ? "constWhite"
                          : isSameDay(date, today)
                            ? "acc1"
                            : "fg1"
                      }
                    >
                      {date.getDate()}
                    </ThemedText>
                  </View>
                  <View
                    style={[
                      styles.dot,
                      marked.has(dayKey(date)) && {
                        backgroundColor: theme.fg3,
                      },
                    ]}
                  />
                </ThemedPressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(month: Date, count: number) {
  return new Date(month.getFullYear(), month.getMonth() + count, 1);
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
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
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
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  arrows: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  arrow: {
    padding: Spacing.one,
  },
  week: {
    flexDirection: "row",
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    paddingVertical: Spacing.one,
  },
  weeks: {
    minHeight: WEEK_HEIGHT * WEEKS,
  },
  cell: {
    flex: 1,
    height: WEEK_HEIGHT,
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
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: Radius.full,
  },
});
