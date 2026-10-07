/** `reserveSupportRow` keeps the support row in place, so an appearing error does not move the button below; also shows a custom `labels.optional` and an explicit `id`. Use it for fields validated on the fly. */
import { Button, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function InputReservedSupportRowExample() {
  const [invalid, setInvalid] = React.useState(false);

  return (
    <div className={styles.stack}>
      <Input.Root
        optional
        labels={{ optional: "если есть" }}
        label="Промокод"
        reserveSupportRow
        error={invalid ? "Промокод недействителен или истёк" : undefined}
      >
        <Input.Wrapper>
          <Input.Field placeholder="Введите код" defaultValue="SAVE50" />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root variant="outline" tone="neutral" onClick={() => setInvalid((v) => !v)}>
        {invalid ? "Убрать ошибку" : "Показать ошибку"}
      </Button.Root>
      <Input.Root id="delivery-phone" label="Телефон для курьера" optional>
        <Input.Wrapper>
          <Input.Field type="tel" autoComplete="tel" placeholder="+7 900 000-00-00" />
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
