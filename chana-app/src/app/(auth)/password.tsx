import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/button";
import { SubmitField } from "@/components/submit-field";
import { ThemedText } from "@/components/themed-text";
import { signInWithPassword } from "@/data/auth";
import { signIn } from "@/data/session";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

/** The optional way in: email + password instead of a code */
export default function Password() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const { pending, error, clearError, run } = useAuthAction();

  const submit = () =>
    run(async () => signIn(await signInWithPassword(email, password)));

  return (
    <AuthScreen title="Enter your password" subtitle={email}>
      <SubmitField
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError();
        }}
        placeholder="Password"
        secureTextEntry
        autoFocus
        autoComplete="current-password"
        textContentType="password"
        invalid={error !== null}
        accessibilityLabel="Password"
        canSubmit={password.length > 0}
        loading={pending}
        submitLabel="Sign in"
        onSubmit={submit}
      />
      {error ? (
        <ThemedText type="sublabel" themeColor="neg1" style={styles.center}>
          {error}
        </ThemedText>
      ) : null}
      {/* Back to the code screen, which can send a new one */}
      <Button
        label="Use a code instead"
        type="default"
        fg="acc1"
        size="small"
        fullWidth
        onPress={() => router.back()}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
});
