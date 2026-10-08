/** A delivery form for phones: the native value goes into FormData, the required city is checked on submit, the error shakes the field and leaves once a city is picked, a calm note confirms the order — `name`, `required`, `error`. */
import { Button, NativeSelect, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function NativeSelectInFormExample() {
  const [error, setError] = React.useState<string>();
  const [saved, setSaved] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const city = String(new FormData(event.currentTarget).get("city") ?? "");
    setError(city ? undefined : "Выберите город доставки");
    setSaved(Boolean(city));
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Typography as="h3" variant="title-m">
        Доставка
      </Typography>
      <NativeSelect
        name="city"
        label="Город"
        required
        error={error}
        placeholder="Выберите город"
        onValueChange={() => {
          setError(undefined);
          setSaved(false);
        }}
      >
        <option value="msk">Москва</option>
        <option value="spb">Санкт-Петербург</option>
        <option value="kzn">Казань</option>
      </NativeSelect>
      <NativeSelect
        name="slot"
        label="Время"
        defaultValue="day"
        onValueChange={() => setSaved(false)}
      >
        <option value="morning">09:00–12:00</option>
        <option value="day">12:00–18:00</option>
        <option value="evening">18:00–21:00</option>
      </NativeSelect>
      <div className={styles.actions}>
        {saved ? (
          <Typography as="p" variant="body-s" tone="secondary">
            Доставка оформлена
          </Typography>
        ) : null}
        <Button.Root type="submit">Продолжить</Button.Root>
      </div>
    </form>
  );
}
