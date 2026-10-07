/** Saving a form: the button shows loading, then a success toast or an error toast with a retry action — `notify`, `action`. */
import { Button, Input, NotificationProvider, useNotifications } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

function ReportsForm() {
  const { notify } = useNotifications();
  const [saving, setSaving] = React.useState(false);
  const [email, setEmail] = React.useState("team@prime.dev");

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      if (email.includes("@")) {
        notify({
          tone: "success",
          title: "Настройки сохранены",
          description: `Отчёты придут на ${email}.`,
        });
      } else {
        notify({
          tone: "danger",
          title: "Не удалось сохранить",
          description: "Укажите корректный адрес почты.",
          action: { label: "Повторить", onClick: save },
        });
      }
    }, 700);
  };

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <Input.Root label="Почта для отчётов" hint="Без «@» сохранение завершится ошибкой" required>
        <Input.Wrapper>
          <Input.Field value={email} onChange={(event) => setEmail(event.target.value)} />
        </Input.Wrapper>
      </Input.Root>
      <div className={styles.actions}>
        <Button.Root type="submit" loading={saving}>
          Сохранить
        </Button.Root>
      </div>
    </form>
  );
}

export default function NotificationInFormExample() {
  // In an app NotificationProvider wraps the root once; here it keeps the example self-contained.
  return (
    <NotificationProvider>
      <ReportsForm />
    </NotificationProvider>
  );
}
