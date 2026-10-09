import { AuthScreen } from "@/components/auth-screen";
import { SubmitField } from "@/components/submit-field";
import { ThemedText } from "@/components/themed-text";
import { createAccount } from "@/data/auth";
import { signIn } from "@/data/session";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

/** Last step for a new email, after its code was verified */
export default function CreateAccount() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [name, setName] = useState("");
  const { pending, error, clearError, run } = useAuthAction();

  const submit = () =>
    run(async () => signIn(await createAccount(email, name)));

  return (
    <AuthScreen
      title="What's your name?"
      subtitle="This is how you'll appear to others on Chana."
    >
      <SubmitField
        value={name}
        onChangeText={(text) => {
          setName(text);
          clearError();
        }}
        placeholder="Your name"
        autoFocus
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        invalid={error !== null}
        accessibilityLabel="Name"
        canSubmit={name.trim().length > 0}
        loading={pending}
        submitLabel="Create account"
        onSubmit={submit}
      />
      {error ? (
        <ThemedText type="sublabel" themeColor="neg1" style={styles.center}>
          {error}
        </ThemedText>
      ) : null}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});
