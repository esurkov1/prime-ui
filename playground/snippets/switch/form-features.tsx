import * as React from "react";

import { Switch } from "@/components/switch/Switch";

import styles from "./snippets.module.css";

export default function SwitchFormFeaturesSnippet() {
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
