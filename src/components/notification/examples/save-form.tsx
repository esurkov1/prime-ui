/** Saving a form: the button shows `loading`, then `notify()` shows a success toast or an error toast with a "Повторить" action. Use it as the default pattern for async save feedback. */
import { Button, Input, NotificationProvider, Typography, useNotifications } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

function SaveForm() {
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
    <div className={styles.card}>
      <Typography.Root as="h3" variant="title-m">
        Рассылка отчётов
      </Typography.Root>
      <Input.Root label="Почта для отчётов" hint="Без «@» сохранение завершится ошибкой">
        <Input.Wrapper>
          <Input.Field value={email} onChange={(e) => setEmail(e.target.value)} />
        </Input.Wrapper>
      </Input.Root>
      <div className={styles.actions}>
        <Button.Root loading={saving} onClick={save}>
          Сохранить
        </Button.Root>
      </div>
    </div>
  );
}

export default function NotificationSaveFormExample() {
  // In an app NotificationProvider wraps the root once; it is here to keep the example self-contained.
  return (
    <NotificationProvider>
      <SaveForm />
    </NotificationProvider>
  );
}
