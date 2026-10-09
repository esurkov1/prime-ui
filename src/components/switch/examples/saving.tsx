/** A setting that applies on the server at once: the thumb waits in its new place with a spinner, and a refused save glides it back and says why — `onCheckedChange`, `error`. */
import { Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** The server's answer a beat later: SMS needs a confirmed phone number. */
function saveSetting(setting: "email" | "sms", enabled: boolean) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (setting === "sms" && enabled) reject(new Error("Сначала подтвердите номер телефона"));
      else resolve();
    }, 900);
  });
}

export default function SwitchSavingExample() {
  const [email, setEmail] = React.useState(true);
  const [sms, setSms] = React.useState(false);
  const [smsError, setSmsError] = React.useState<string>();

  return (
    <div className={styles.form}>
      <Switch.Root
        checked={email}
        onCheckedChange={async (enabled) => {
          await saveSetting("email", enabled);
          setEmail(enabled);
        }}
        hint="Счета и акты на почту бухгалтерии"
      >
        <Switch.Label>Документы на почту</Switch.Label>
      </Switch.Root>
      <Switch.Root
        checked={sms}
        error={smsError}
        onCheckedChange={async (enabled) => {
          setSmsError(undefined);
          try {
            await saveSetting("sms", enabled);
          } catch (error) {
            setSmsError(error instanceof Error ? error.message : String(error));
            throw error;
          }
          setSms(enabled);
        }}
        hint="Код и статус оплаты по SMS"
      >
        <Switch.Label>SMS-уведомления</Switch.Label>
      </Switch.Root>
    </div>
  );
}
