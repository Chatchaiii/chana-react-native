import { AuthScreen } from "@/components/auth/auth-screen";
import { Button } from "@/components/ui/button";
import { SubmitField } from "@/components/auth/submit-field";
import { signInWithPassword } from "@/data/auth";
import { signIn } from "@/data/session";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

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
        error={error}
        accessibilityLabel="Password"
        canSubmit={password.length > 0}
        loading={pending}
        submitLabel="Sign in"
        onSubmit={submit}
      />
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
