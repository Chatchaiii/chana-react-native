import { ActionRow } from "@/components/action-row";
import { List } from "@/components/list";
import { ThemedAvatar } from "@/components/themed-avatar";
import { ThemedText } from "@/components/themed-text";
import { CURRENT_USER } from "@/constants/placeholder-user";
import { Spacing } from "@/constants/theme";
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
    // The sheet already floats above the home indicator, so no safe-area padding
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedAvatar
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.five,
    paddingBottom: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  header: {
    alignItems: "center",
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  names: {
    alignItems: "center",
  },
});
