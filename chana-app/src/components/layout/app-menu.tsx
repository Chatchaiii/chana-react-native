import { Button, type ButtonProps } from "@/components/ui/button";
import { useDrawer } from "@/components/layout/side-drawer";
import { ThemedText } from "@/components/ui/themed-text";
import { MenuSections, type MenuSection, type Tab } from "@/constants/tabs";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useTabTrigger } from "expo-router/ui";
import { StyleSheet, View } from "react-native";
import Animated, {
  clamp,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Scrolled this far, the header's bottom edge is fully drawn
const HEADER_EDGE_DISTANCE = Spacing.two;

/**
 * The side menu as its own screen: the app name in a header that stays put,
 * and one button per tab (grouped by `MenuSections`) scrolling under it
 */
export function AppMenu() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.set(event.contentOffset.y);
  });

  // A hairline under the header once content scrolls beneath it
  const edgeStyle = useAnimatedStyle(() => ({
    opacity: clamp(scrollY.get() / HEADER_EDGE_DISTANCE, 0, 1),
  }));

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.menu, paddingLeft: insets.left },
      ]}
    >
      <View
        style={[
          styles.header,
          // Landscape has no top inset, so keep the heading off the edge
          { paddingTop: Math.max(insets.top, Spacing.three) },
        ]}
      >
        <ThemedText type="heading_2" accessibilityRole="header">
          CHANA
        </ThemedText>
        <Animated.View
          style={[styles.headerEdge, { backgroundColor: theme.bg3 }, edgeStyle]}
        />
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, Spacing.three) },
        ]}
      >
        {MenuSections.map((section, index) => (
          <View
            key={index}
            style={[
              sectionStyles[section.variant],
              section.spaceBefore
                ? { marginTop: Spacing[section.spaceBefore] }
                : null,
            ]}
          >
            {section.tabs.map((tab) => (
              <MenuItem key={tab.route} tab={tab} variant={section.variant} />
            ))}
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

type MenuItemProps = {
  tab: Tab;
  variant: MenuSection["variant"];
};

/** A tab's button: switches to the tab (keeping where you were in it) and closes the menu */
function MenuItem({ tab, variant }: MenuItemProps) {
  const { close } = useDrawer();
  const { triggerProps, switchTab } = useTabTrigger({ name: tab.route });
  const focused = triggerProps.isFocused;

  return (
    <Button
      icon={tab.icon}
      label={tab.title}
      type={focused ? "prominent" : "secondary"}
      bg={focused ? undefined : "menuButton"}
      {...buttonProps[variant]}
      accessibilityState={{ selected: focused }}
      onPress={() => {
        // Tapping the current tab just closes the menu
        if (!focused) switchTab(tab.route, {});
        close();
      }}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  headerEdge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: StyleSheet.hairlineWidth,
  },
  content: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  rowButton: {
    flex: 1,
  },
});

/** Layout of each section variant */
const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
});

/** Button look per section variant: row = side-by-side tiles, list = full-width rows */
const buttonProps = {
  row: {
    size: "medium_1",
    radius: "sm",
    fullWidth: true,
    style: styles.rowButton,
  },
  list: { size: "medium_2", radius: "md", align: "left", fullWidth: true },
} satisfies Record<MenuSection["variant"], Partial<ButtonProps>>;
