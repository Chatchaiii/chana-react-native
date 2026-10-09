import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/button";
import { SubmitField } from "@/components/submit-field";
import { ThemedText } from "@/components/themed-text";
import { Wordmark } from "@/components/wordmark";
import { isValidEmail, requestCode } from "@/data/auth";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useSplashIntro } from "@/hooks/use-splash-intro";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

// TODO: Apple (expo-apple-authentication) and Google (expo-auth-session) sign-in
const notAvailableYet = (provider: string) =>
  Alert.alert(`${provider} sign-in`, "This isn't available yet.");

/**
 * Welcome: Google, Apple, or an email for signing in and signing up alike.
 * An email gets a code next; whether the account exists is only decided
 * after the code is verified
 */
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { pending, error, clearError, run } = useAuthAction();
  const {
    wordmarkRef,
    onWordmarkLayout,
    wordmarkStyle,
    contentStyle,
    contentPointerEvents,
  } = useSplashIntro();
  const valid = isValidEmail(email);

  const submit = () =>
    run(async () => {
      await requestCode(email);
      router.push({ pathname: "/verify", params: { email: email.trim() } });
    });

  return (
    <AuthScreen
      header={
        <Animated.View
          ref={wordmarkRef}
          onLayout={onWordmarkLayout}
          style={wordmarkStyle}
        >
          <Wordmark />
        </Animated.View>
      }
      contentStyle={contentStyle}
      contentPointerEvents={contentPointerEvents}
      footer={
        <ThemedText type="subtext" themeColor="fg2" style={styles.legal}>
          By continuing, you agree to Chana’s{" "}
          <ThemedText type="subtext" style={styles.link}>
            Terms of Service
          </ThemedText>{" "}
          and{" "}
          <ThemedText type="subtext" style={styles.link}>
            Usage Policy
          </ThemedText>
          , and acknowledge the{" "}
          <ThemedText type="subtext" style={styles.link}>
            Privacy Policy
          </ThemedText>
          .
        </ThemedText>
      }
    >
      <Button
        label="Continue with Google"
        type="primary"
        size="medium_1"
        radius="md"
        fullWidth
        onPress={() => notAvailableYet("Google")}
      />
      <Button
        label="Continue with Apple"
        type="primary"
        size="medium_1"
        radius="md"
        fullWidth
        onPress={() => notAvailableYet("Apple")}
      />

      <SubmitField
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError();
        }}
        placeholder="Personal or work email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        error={error}
        accessibilityLabel="Email"
        canSubmit={valid}
        loading={pending}
        submitLabel="Continue with email"
        onSubmit={submit}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  legal: {
    textAlign: "center",
  },
  // TODO: open the documents once they exist
  link: {
    textDecorationLine: "underline",
  },
});
