@AGENTS.md

# Chana — project notes for Claude

Read this before working on the app. Keep it up to date when architecture, conventions or preferences change.

## Stack

- Expo SDK 57, expo-router 57, React Native 0.86 (New Architecture), React 19, React Compiler on, typed routes on.
- Animations: react-native-reanimated 4 + react-native-worklets. Gestures: react-native-gesture-handler.
- Icons: the user's own icons in `assets/icons` (24px SVGs, SF Symbols-style names like `chevron.right`, `home.fill`), converted by `npm run icons` into `src/constants/icons.generated.ts` and rendered via `ThemedIcon icon="name"` at 18px (`Icon` with a raw color, e.g. on photos). No icon library — Hugeicons was removed; don't add one back. SF Symbols / Material symbols only in native toolbar items. `star`/`star.fill` are placeholders drawn by Claude until the user designs their own.
- Other: expo-image, expo-haptics, expo-status-bar. No font packages (custom fonts were tried and reverted — keep the system font).
- The user runs the app in **Expo Go** on an iPhone; the dev server (Metro on :8081) is usually already running.

## Verify before declaring done

```bash
npx tsc --noEmit                      # must be clean (example/ is excluded)
npx expo lint                         # must be clean
npx prettier --write <changed files>  # only format files you touched
```

Visual check in the iOS simulator (iPhone 17 Pro, UDID `86094CF1-8555-42D3-803A-AC76915573F1`, Expo Go installed):
- Open/reload: `xcrun simctl terminate <udid> host.exp.Exponent`, then `open_url exp://127.0.0.1:8081` (the simctl openurl right after terminate often lands on the home screen — use the simulator tool's `open_url`).
- Screenshots lag ~1–3 s behind actions; take a second screenshot before concluding anything.
- Menu button ≈ (38, 83) pt; viewer close button ≈ (364, 90) pt. Don't start horizontal swipes at the left edge (opens the drawer).
- Haptics can't be felt in the simulator — say so.

Android: the user also tests on the `Pixel_10` emulator (`emulator-5554`, adb at `~/Library/Android/sdk/platform-tools/adb`). Open with `adb shell am start -a android.intent.action.VIEW -d exp://192.168.0.231:8081`, screenshot with `adb exec-out screencap -p`, and poll `uiautomator dump` for on-screen text instead of sleeping.

## Architecture

```
src/app/_layout.tsx                 Root: GestureHandlerRootView > ThemeProvider > SafeAreaProvider > Drawer
src/app/<tab>/_layout.tsx           One-line re-export of DrawerStack + unstable_settings (all tabs identical)
src/app/<tab>/index.tsx             <TabScreen tab={Tabs.x}>…content…</TabScreen>
src/app/<tab>/new.tsx               <CreateScreen tab={Tabs.x} /> (modal)
src/app/<tab>/profile.tsx           One-line re-export of ProfileSheet (sheet, opened from the header avatar)
src/constants/tabs.ts               Single source of truth for tabs: route, title, icon (filled, same for active and inactive), optional searchTitle (omit = not in search), optional create {label, href} (omit = no create button / new.tsx), profileHref. First entry = the tab the app opens on. `MenuSections` sets the drawer's groups and order
src/constants/theme.ts              Colors (light/dark), OverlayColors, Fonts, Spacing, Radius, ContainerSizes
src/constants/motion.ts             Timings (fast/normal/slow eased), PressSpring, ListPressDelay
src/types/                          Domain types: post.ts (Post), place.ts (Place), comment.ts (Comment), rating.ts (RatingValue, UserRating), user.ts (User)
src/data/                           Stand-in content until there's a backend: posts.ts, places.ts, comments.ts (by postId), current-user.ts (CURRENT_USER)
src/utils/haptics.ts                HapticStyles (press, drawer) + playHaptic
src/utils/strings.ts                getInitials
src/utils/ratings.ts                averageRating, formatRating (4 → "4", 4.33 → "4.3")
```
Tabs: `(home)` (Home/posts), `places`, `wishes`, `calendar`, plus `activity`, `saved`, `couple` (placeholder pages, no create/search).

- **Drawer** (`app/_layout.tsx`): `drawerType: "back"` (menu stays behind, screen slides over it), 80% width, no right border, transparent overlay. Drawer screens are built from `Tabs`. The swipe-to-open is only enabled while a tab is on its `index` (`getFocusedRouteNameFromRoute`), so the left-edge swipe on pushed pages is the native back gesture.
- **DrawerStack** (`components/drawer-stack.tsx`): layout of every tab. A `Stack` (pushed pages get a minimal back button: chevron only) declaring `index` first, then `new` as a modal and `profile` as a sheet (`SheetScreenOptions`, also exported for tab-specific sheets) (declared screens are ordered before file routes, so without `index` first a tab would open on `new`). Animates rounded corners + border + fade from `useDrawerProgress()`. Also exports `unstable_settings` (`initialRouteName: "index"`), which each tab layout re-exports.
- **TabScreen** (`components/tab-screen.tsx`): takes `tab` (and optional `title`, defaults to `tab.title`). Sets header (MenuButton left, avatar right, transparent), `Stack.SearchBar`, and bottom `Stack.Toolbar` (search slot + create button → `tab.create.href`). Search is global; `SearchResults` groups by `tab.searchTitle`. Toolbar must be declared in pages, not layouts; iOS 26+ only.
- **AppDrawerContent**: not scrollable (plain View + safe-area insets). "CHANA" heading + one group of `Button`s per `MenuSections` entry (`variant` row/list → `sectionStyles` + `buttonProps` lookup tables, optional `spaceBefore`) (active = `primary`, tapping active closes drawer) + `useDrawerHaptics()` (`hooks/use-drawer-haptics.ts`).
- Adding a tab: entry in `Tabs` (incl. `profileHref`) and in `MenuSections` + folder with the one-line `_layout.tsx`, an `index.tsx` using `TabScreen`, a `new.tsx` using `CreateScreen` (only with `create`), and the one-line `profile.tsx`. Tabs without `create` use `<DrawerStack withCreate={false} />` in their layout (declaring a missing `new` route warns).
- Places has `places/[id]` (place detail page, opened from `PlaceItem`). Its state lives in `PlaceContent`, keyed by place id, so it resets if the screen is reused for another place (e.g. a deep link).
- Routes only one tab has are declared as `children` of `DrawerStack` in that tab's layout. Home has `post/[id]` (the post detail page, opened by tapping a post in the feed) and declares `post/[id]/options`: a native `formSheet` (`sheetAllowedDetents: "fitToContents"`, grabber) opened from a post's "…" button with the post id. Sheet bodies use `SheetContent` (no bottom safe-area padding: on iOS 26 the sheet floats).

## Components

| Component | Purpose |
|---|---|
| `ThemedText` | `type` (`TextType`): heading, heading_2–4, label, sublabel, text, subtext, code; `themeColor` |
| `ThemedView`, `ThemedIcon` | Theme-colored primitives. Icon: `icon` is an `IconName` from assets/icons; `Icon` is the raw-color version (e.g. on photos) |
| `ThemedPressable` | Unstyled pressable: haptic (default `HapticStyles.press`, `haptic={false}` to disable), scale+dim on press, disabled dim. Use for any tappable item |
| `Button` | Styled button on ThemedPressable: `type` (default/prominent/primary/secondary/tertiary), `size` (small/medium_1/medium_2/large), `radius` (Radius key, default `sm`), `align`, `fullWidth`, optional `icon`, `sublabel` |
| `Avatar` | Person picture: `src` (expo-image) or initials of `name` (`initialsType` text style), `size` (ContainerSizes), `radius` |
| `CheckItem` | Radio-style checkable row (`checked`, `onPress`, `label`, `sublabel`). `children` are trailing controls (e.g. `DatePickerButton`) rendered beside the pressable, not inside it, so tapping them doesn't toggle the item |
| `DatePickerButton` | Native date picker as a button. iOS: SwiftUI compact `DatePicker` from `@expo/ui/swift-ui` (popover keeps the system blue; `tint` isn't applied to it). Android/web: themed chip that opens `DateTimePicker` from `@expo/ui/community/datetime-picker` as a dialog |
| `MenuButton` | Header button that opens the drawer |
| `ScreenScrollView` / `useScreenInsets` | ScrollView root with `contentInsetAdjustmentBehavior="automatic"` (iOS) + Android header/bottom padding. Don't wrap scroll content in SafeAreaView |
| `SheetContent` | Padded column for the body of a native sheet (post options, profile) |
| `EmptyState` | Centered fg2 hint where content is missing ("No comments yet.", "This place doesn't exist anymore.") |
| `List` | Stacks children with `Separator` between; `type`: plain / card (bg1, `Radius.md`, clipped) |
| `Separator` | 1px bg3 line, `padding` (SpacingKey) inset, horizontal/vertical |
| `ListItem` | Generic row, no domain knowledge. Slots: `leading` (avatar/thumbnail), `overline`, `label` + `addOn`, `sublabel` (`sublabelLines`, default 2), `footer`. `onOptionsPress` → "…" button; `onPress` → whole row pressable + chevron. Domain rows wrap it (`PostItem`, `PlaceItem`) instead of adding domain props to it |
| `PostItem` | Renders a `Post`: `ListItem` (author row) + optional `ImageCarousel` + `ExpandableText` + `PostActions`, and sets their spacing. `variant="feed"` (default) is a ThemedPressable that opens `/post/[id]` (no haptic, `ListPressDelay`; `accessible={false}` so inner controls stay reachable); `variant="detail"` shows the full text |
| `ExpandableText` | `title` + `text`, truncated to 3 lines; View more/less animates height. `collapsible={false}` shows the full text |
| `PostActions` | Right-aligned comment + save buttons with counts (hidden when 0). A button only renders when its handler is set |
| `PlaceItem` / `PlaceMeta` | Renders a `Place` via ListItem with `Thumbnail`, `PlaceMeta` overline (author, distance, visited) and average-rating footer; opens `/places/[id]` |
| `Thumbnail` | Rectangular image (`size` = height, `aspectRatio`, `radius`), placeholder icon when no `src` |
| `Rating` | 1–5 stars (`star.fill` in acc1 / `star` in fg3); `value` 0 = not rated. Read-only unless `onChange` is set (each star becomes a ThemedPressable with hitSlop). Exports `MAX_RATING` |
| `RatingSummary` | Card (`List type="card"`) with the average as a `RingChart` + number, then one row per person's stars. With `currentUser` + `onRate`, that user's row is tappable (larger stars) and shown with empty stars until they've rated. `withUserRating` (utils/ratings) updates the list |
| `RingChart` | Ring filled clockwise from 12 o'clock to `portion / total` (optional `startPortion`), animated from the current fill. `size` (ContainerSizes), `strokeWidth` s/m/l; announced as a progress bar |
| `ActionRow` | Icon + label row on ThemedPressable (`destructive` → neg1), for options in sheets/menus |
| `ImageCarousel` | Paging images, "1/4" counter + animated dots, tap → `ImageViewer`. No outer margin — the parent places it |
| `ImageViewer` | Modal viewer that expands from the thumbnail (`measureInWindow`), swipe sideways to browse, vertical drag to dismiss |
| `CreateScreen` | Body of each tab's `new.tsx` modal (takes a `CreatableTab`) |
| `ProfileSheet` | Signed-in user's sheet (avatar, name, Edit profile / Settings / Log out — actions still TODO) |

## Conventions

- Files kebab-case; always import via `@/…` (no relative imports); double quotes; Prettier formatting. Imports sorted: `@/…` first (alphabetical by path), then packages.
- Naming: the `Themed` prefix is only for thin wrappers of RN primitives (`ThemedText`, `ThemedView`, `ThemedIcon`, `ThemedPressable`); everything else is named for what it is (`Button`, `Avatar`, `CheckItem`, …). `…Item` = a list row (`ListItem`, `PostItem`, `PlaceItem`). Domain types live in `src/types`, stand-in content in `src/data`, never in components or `constants/`.
- **No magic numbers for shared design values.** Use `Spacing`, `Radius`, `ContainerSizes`, `Colors` via `useTheme()`, `OverlayColors` for UI on top of photos, `Timings` / `PressSpring` for motion, `HapticStyles` + `playHaptic` for haptics. Component-specific constants (e.g. `DOT_SIZE`) stay local, in SCREAMING_CASE at the top of the file.
- Styles: `StyleSheet.create` at the bottom of the module, camelCase keys; variants as lookup tables (`TypeColors`, `sizeStyles`) composed in a style array; theme colors applied inline. Spacing around a component is set by its parent (via `style`), not baked into the component.
- Props: component props types are `<Component>Props`, extend the underlying RN props when they forward them, and use defaults in the destructuring. Content comes in through props, never hardcoded in a component.
- Reanimated: `.get()` / `.set()` on shared values (React Compiler), `scheduleOnRN` from react-native-worklets to call JS from worklets.
- Prefer eased `withTiming` (`Timings.*`) over springs for transitions — the user found springy, large motion "too much". Springs only for press feedback.
- Comments: short, explain *why*; match the surrounding density.

## Gotchas learned

- A ScrollView's `contentOffset` prop is re-applied whenever it changes. Never derive it from a value that changes while scrolling (e.g. a parent that follows the current page) — capture it once with `useState(initial)`. This made `ImageViewer` snap and skip pages.
- `StyleSheet.absoluteFillObject` doesn't exist in RN 0.86 — spell out `position/top/right/bottom/left`.
- Rounded drawer scenes: drawer `sceneStyle` background shows in corners; the drawer has a built-in hairline right border (`borderRightWidth: 0`).
- A `Modal` that never finishes its close animation stays on top invisibly and blocks all touches. Always call `onClose` when the close animation ends (don't gate on `finished`), guard against double dismiss.
- Haptics: anything that both taps a ThemedPressable and opens/closes the drawer plays two haptics.
- Never render optional strings with `&&` (`{text && <ThemedText>…}`): an empty string or `0` lands outside `<Text>` and crashes. Use a ternary or an explicit check (`count > 0`).
- `experimental_backgroundImage: "linear-gradient(...)"` works natively (no expo-linear-gradient needed).
- Adding/changing an icon: drop the SVG into `assets/icons` and run `npm run icons`. Draw shapes in black and cut-out details in white (the generator turns white into a transparent mask cut-out, so `.fill` icons work in dark mode); a white 24×24 background rect and clip-path wrappers are stripped. Never edit `icons.generated.ts` by hand.
- Claude's brand fonts (Styrene, Tiempos) are licensed — don't add them.
- Never call `SplashScreen.preventAutoHideAsync()` without a matching `hideAsync()` — on Android the splash then never disappears (iOS hides it anyway, so it looks fine there).
- `Stack.Toolbar.Button` on Android needs an image source, not an SF Symbol, and warns even when `hidden`. `TabScreen` renders the create button only once `useMaterialSymbolSource("edit_square")` has produced the Android image.

## Working with the user

- Often asks "how do I…" first, then "yes"/"apply it" — explain with a recommendation, then implement on confirmation. Direct requests ("add", "make") → implement.
- The user edits files in parallel (often while I work) and stages their own changes. Re-read files before editing; don't revert their edits. Their in-progress files may not compile — leave them alone and mention it.
- Wants iOS-native-feeling, smooth but restrained UI; rest states sharp. When they say "revert/keep it like this", don't reintroduce the change.
- Verify UI changes in the simulator myself rather than asking the user to check.
- "Create a PR and merge it": include all current changes (staged + unstaged + untracked in `chana-app/`), branch `feat/<topic>` from up-to-date `main`, commit with Co-Authored-By trailer, `gh pr create`, `gh pr merge <n> --merge --delete-branch`. The user can't approve their own PR (GitHub blocks self-approval) — merge directly. PR body: Summary / Testing / Notes, honest about what wasn't verified.
- Repo: `Chatchaiii/chana-react-native`, app lives in `chana-app/`. No CI configured.
