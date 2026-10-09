/** A client form in two groups: while the request runs every field inside is disabled at once and the submit button shows its progress — `label`, `disabled`. */
import { Button, Fieldset, Input, Radio, Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SAVE_DELAY_MS = 1200;

export default function FieldsetInFormExample() {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, SAVE_DELAY_MS);
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit} onChange={() => setSaved(false)}>
      <Fieldset label="Реквизиты" disabled={saving}>
        <Radio.Group label="Тип клиента" defaultValue="company" orientation="horizontal">
          <Radio.Root value="company">
            <Radio.Label>Компания</Radio.Label>
          </Radio.Root>
          <Radio.Root value="person">
            <Radio.Label>ИП</Radio.Label>
          </Radio.Root>
        </Radio.Group>
        <Input.Root label="Название" required>
          <Input.Wrapper>
            <Input.Field name="name" defaultValue="ООО «Северный ветер»" />
          </Input.Wrapper>
        </Input.Root>
      </Fieldset>
      <Fieldset
        label="Уведомления"
        description="Письма уходят на почту для счетов."
        disabled={saving}
      >
        <Switch.Root name="invoices" defaultChecked>
          <Switch.Label>Новые счета</Switch.Label>
        </Switch.Root>
        <Switch.Root name="reminders">
          <Switch.Label>Напоминания об оплате</Switch.Label>
        </Switch.Root>
      </Fieldset>
      <div className={styles.actions}>
        <Button.Root type="submit" loading={saving} tone={saved ? "success" : "accent"}>
          {saved ? "Сохранено" : "Сохранить"}
        </Button.Root>
      </div>
    </form>
  );
}
