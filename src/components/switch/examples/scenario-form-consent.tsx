import { Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/**
 * Form submit: native `name` / `value` with FormData; required consent switch.
 */
export default function SwitchScenarioFormConsent() {
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const terms = data.get("terms") === "on";
        setMessage(
          terms ? "Terms accepted — you can continue checkout." : "Please accept the terms.",
        );
      }}
    >
      <Switch.Root name="terms" required>
        <Switch.Label>I agree to the Terms of Service and Privacy Policy</Switch.Label>
        <Switch.Hint>Required to place an order.</Switch.Hint>
      </Switch.Root>
      <button type="submit" className={styles.formSubmit}>
        Continue to payment
      </button>
      {message != null ? <p className={styles.formMessage}>{message}</p> : null}
    </form>
  );
}
