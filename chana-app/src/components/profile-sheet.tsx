import { ActionRow } from "@/components/action-row";
import { Avatar } from "@/components/avatar";
import { List } from "@/components/list";
import { SheetContent } from "@/components/sheet-content";
import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { CURRENT_USER } from "@/data/current-user";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

/**
 * Sheet for the signed-in user, opened from the avatar in the header. Every
 * tab's `profile.tsx` renders it.
 */
export function ProfileSheet() {
  const router = useRouter();

  // TODO: implement each action; for now they just close the sheet
  const close = () => router.back();

  return (
    <SheetContent>
      <View style={styles.header}>
        <Avatar
          src={CURRENT_USER.avatar}
          name={CURRENT_USER.name}
          size="xxl"
          initialsType="heading_2"
        />
        <View style={styles.names}>
          <ThemedText type="heading_3">{CURRENT_USER.name}</ThemedText>
          <ThemedText type="subtext" themeColor="fg2">
            {CURRENT_USER.handle}
          </ThemedText>
        </View>
      </View>

      <List type="card">
        <ActionRow icon="user" label="Edit profile" onPress={close} />
        <ActionRow icon="gear" label="Settings" onPress={close} />
      </List>

      <List type="card">
        <ActionRow
          icon="square.and.arrow.right"
          label="Log out"
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
