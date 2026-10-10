import { AuthScreen } from "@/components/auth/auth-screen";
import { SubmitField } from "@/components/auth/submit-field";
import { createAccount } from "@/data/auth";
import { signIn } from "@/data/session";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

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
        error={error}
        accessibilityLabel="Name"
        canSubmit={name.trim().length > 0}
        loading={pending}
        submitIcon="checkmark"
        submitLabel="Create account"
        onSubmit={submit}
      />
    </AuthScreen>
  );
}
