/** Regional settings form: the required country is checked on submit, the error shakes the field and leaves once a country is picked, a calm note confirms the save — `required`, `error`, `hint`. */
import { Button, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SelectInFormExample() {
  const [country, setCountry] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [saved, setSaved] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(country ? undefined : "Выберите страну");
    setSaved(Boolean(country));
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.formHeader}>
        <Typography as="h3" variant="title-m">
          Региональные настройки
        </Typography>
        <Typography as="p" variant="body-s" tone="secondary">
          Влияют на валюту, формат дат и время в отчётах.
        </Typography>
      </div>
      <div className={styles.formFields}>
        <Select.Root
          label="Страна"
          required
          error={error}
          placeholder="Выберите страну"
          value={country}
          onValueChange={(value) => {
            setCountry(value);
            setError(undefined);
            setSaved(false);
          }}
        >
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="ru">Россия</Select.Item>
            <Select.Item value="kz">Казахстан</Select.Item>
            <Select.Item value="am">Армения</Select.Item>
          </Select.Content>
        </Select.Root>
        <Select.Root
          label="Часовой пояс"
          hint="Время в отчётах и уведомлениях"
          defaultValue="msk"
          onValueChange={() => setSaved(false)}
        >
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="kal">Калининград, UTC+2</Select.Item>
            <Select.Item value="msk">Москва, UTC+3</Select.Item>
            <Select.Item value="ekb">Екатеринбург, UTC+5</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
      <div className={styles.formActions}>
        {saved ? (
          <Typography as="p" variant="body-s" tone="secondary">
            Настройки сохранены
          </Typography>
        ) : null}
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="reset"
          onClick={() => {
            setCountry("");
            setError(undefined);
            setSaved(false);
          }}
        >
          Отменить
        </Button.Root>
        <Button.Root type="submit">Сохранить</Button.Root>
      </div>
    </form>
  );
}
