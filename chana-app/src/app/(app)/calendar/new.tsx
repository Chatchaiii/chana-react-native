import { CreateScreen } from "@/components/layout/create-screen";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TextField } from "@/components/ui/text-field";
import { ThemedView } from "@/components/ui/themed-view";
import { Tabs } from "@/constants/tabs";
import { Radius, Spacing } from "@/constants/theme";
import { CURRENT_USER } from "@/data/current-user";
import { addEvent } from "@/data/events";
import { useSession } from "@/data/session";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

/** Form to add an event; opens on the day picked in the calendar */
export default function NewEvent() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();
  const author = (useSession() ?? CURRENT_USER).name;
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() =>
    params.date ? new Date(params.date) : new Date(),
  );
  const canAdd = title.trim().length > 0;

  const add = () => {
    if (!canAdd) return;
    addEvent(title, date, author);
    router.back();
  };

  return (
    <CreateScreen tab={Tabs.calendar}>
      <TextField
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        type="label"
        autoFocus
        returnKeyType="done"
        accessibilityLabel="Title"
      />
      <ThemedView themeColor="bg1" style={styles.card}>
        <Calendar value={date} onChange={setDate} />
      </ThemedView>
      <Button
        label="Add event"
        type="primary"
        size="medium_2"
        radius="md"
        fullWidth
        disabled={!canAdd}
        onPress={add}
      />
    </CreateScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});
