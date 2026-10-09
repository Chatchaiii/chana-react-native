import { ActionRow, ActionRowSeparatorInset } from "@/components/action-row";
import { Avatar } from "@/components/avatar";
import { List } from "@/components/list";
import { SheetContent } from "@/components/sheet-content";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { CURRENT_USER } from "@/data/current-user";
import { signOut, useSession } from "@/data/session";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

/**
 * Sheet for the signed-in user, opened from the avatar in the header. Every
 * tab's `profile.tsx` renders it.
 */
export function ProfileSheet() {
  const router = useRouter();
  // TODO: use the session everywhere once CURRENT_USER is gone
  const user = useSession() ?? CURRENT_USER;

  // TODO: implement each action; for now they just close the sheet
  const close = () => router.back();

  return (
    <SheetContent>
      <View style={styles.header}>
        <Avatar
          src={user.avatar}
          name={user.name}
          size="xxl"
          initialsType="heading_2"
        />
        <View style={styles.names}>
          <ThemedText type="heading_3">{user.name}</ThemedText>
          <ThemedText type="subtext" themeColor="fg2">
            {user.handle}
          </ThemedText>
        </View>
      </View>

      <List type="card" separatorInsetLeading={ActionRowSeparatorInset}>
        <ActionRow
          icon="user.card.fill"
          label="Personal information"
          chevron
          onPress={close}
        />
        <ActionRow
          icon="lock.fill"
          label="Sign-In & Security"
          chevron
          onPress={close}
        />
        <ActionRow icon="gear.fill" label="Settings" chevron onPress={close} />
      </List>

      <List type="card" separatorInsetLeading={ActionRowSeparatorInset}>
        <ActionRow
          icon="bell.fill"
          label="Notification"
          chevron
          onPress={close}
        />
        <ActionRow
          icon="circle.fill.half"
          label="Language & Appearance"
          chevron
          onPress={close}
        />
      </List>

      <List type="card" separatorInsetLeading={ActionRowSeparatorInset}>
        <ActionRow
          icon="square.and.arrow.right.fill"
          label="Log out"
          // The root layout swaps to the welcome screen
          onPress={signOut}
        />
        <ActionRow
          icon="trash.fill"
          label="Delete Account"
          destructive
          onPress={close}
        />
      </List>
    </SheetContent>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  names: {
    alignItems: "center",
  },
});
