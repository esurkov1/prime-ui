/** Regional settings form: the required country is checked on submit, the error replaces the hint — `required`, `error`, `hint`. */
import { Button, Select, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SelectInFormExample() {
  const [country, setCountry] = React.useState("");
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(country ? undefined : "Выберите страну");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.formHeader}>
        <Typography.Root as="h3" variant="title-m">
          Региональные настройки
        </Typography.Root>
        <Typography.Root as="p" variant="body-s" tone="secondary">
          Влияют на валюту, формат дат и время в отчётах.
        </Typography.Root>
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
        <Select.Root label="Часовой пояс" hint="Время в отчётах и уведомлениях" defaultValue="msk">
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
        <Button.Root variant="ghost" tone="neutral" type="reset">
          Отменить
        </Button.Root>
        <Button.Root type="submit">Сохранить</Button.Root>
      </div>
    </form>
  );
}
