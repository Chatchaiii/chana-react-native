import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/button";
import { CodeInput } from "@/components/code-input";
import { ThemedText } from "@/components/themed-text";
import { CODE_LENGTH, DEV_CODE, requestCode, verifyCode } from "@/data/auth";
import { signIn } from "@/data/session";
import { useAuthAction } from "@/hooks/use-auth-action";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

// Seconds before another code can be sent
const RESEND_COOLDOWN = 30;

/** Enter the emailed code; checks it as soon as the last digit is in */
export default function Verify() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const { pending, error, clearError, run } = useAuthAction();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const check = (value: string) =>
    run(async () => {
      try {
        const result = await verifyCode(email, value);
        if (result.status === "signedIn") {
          // The root layout swaps to the app
          signIn(result.user);
        } else {
          router.push({ pathname: "/create-account", params: { email } });
        }
      } catch (caught) {
        // Empty boxes, ready for another try
        setCode("");
        throw caught;
      }
    });

  const resend = () =>
    run(async () => {
      await requestCode(email);
      setCode("");
      setCooldown(RESEND_COOLDOWN);
    });

  return (
    <AuthScreen
      title="Check your email"
      subtitle={`Enter the ${CODE_LENGTH}-digit code we sent to ${email}.`}
      footer={
        __DEV__ ? (
          <ThemedText type="subtext" themeColor="fg3" style={styles.center}>
            Development: every code is {DEV_CODE}
          </ThemedText>
        ) : null
      }
    >
      <CodeInput
        value={code}
        onChangeText={(next) => {
          setCode(next);
          clearError();
          if (next.length === CODE_LENGTH) check(next);
        }}
        length={CODE_LENGTH}
        loading={pending}
        error={error}
        autoFocus
      />

      <View style={styles.links}>
        <Button
          label={cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          type="default"
          fg="fg2"
          size="small"
          disabled={cooldown > 0 || pending}
          onPress={resend}
        />
        <Button
          label="Use password instead"
          type="default"
          fg="acc1"
          size="small"
          disabled={pending}
          onPress={() =>
            router.push({ pathname: "/password", params: { email } })
          }
        />
      </View>
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  center: {
    textAlign: "center",
  },
  links: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
