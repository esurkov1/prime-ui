/** Choices of an order form: a required group shows its error after a submit without a choice, an optional one is marked — `name`, `required`, `optional`, `error`. */
import { Button, Radio } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function RadioInFormExample() {
  const [error, setError] = React.useState<string>();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const chosen = new FormData(event.currentTarget).get("delivery");
    setError(chosen ? undefined : "Выберите способ доставки");
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <Radio.Group
        label="Способ доставки"
        name="delivery"
        required
        error={error}
        onValueChange={() => setError(undefined)}
      >
        <Radio.Root value="courier">
          <Radio.Label>Курьером до склада</Radio.Label>
        </Radio.Root>
        <Radio.Root value="pickup">
          <Radio.Label>Самовывоз с терминала</Radio.Label>
        </Radio.Root>
      </Radio.Group>
      <Radio.Group label="Упаковка" name="packing" optional>
        <Radio.Root value="pallet">
          <Radio.Label>На паллетах</Radio.Label>
        </Radio.Root>
        <Radio.Root value="crate">
          <Radio.Label>В обрешётке</Radio.Label>
        </Radio.Root>
      </Radio.Group>
      <div className={styles.formActions}>
        <Button.Root type="submit">Оформить заказ</Button.Root>
      </div>
    </form>
  );
}
