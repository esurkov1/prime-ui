import { Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** `name`, `defaultChecked`, `required` и submit; mirrors `playground/snippets/switch/form-features.tsx`. */
export default function SwitchFormFeaturesExample() {
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setMessage(data.get("newsletter") === "on" ? "Подписка включена" : "Флажок не отмечен");
      }}
    >
      <Switch.Root name="newsletter" defaultChecked>
        <Switch.Label>Новости продукта</Switch.Label>
      </Switch.Root>
      <Switch.Root name="digest" required>
        <Switch.Label>Еженедельный дайджест (обязательно)</Switch.Label>
      </Switch.Root>
      <button type="submit" className={styles.formSubmit}>
        Отправить
      </button>
      {message != null ? <p className={styles.formMessage}>{message}</p> : null}
    </form>
  );
}
