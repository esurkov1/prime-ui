/** Company details form: required fields checked on submit, neighbours keep their bottoms aligned — `required`, `error`, `reserveSupportRow`. */
import { Button, Input, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Errors = { name?: string; inn?: string };

function validate(form: FormData): Errors {
  const errors: Errors = {};
  if (!String(form.get("name") ?? "").trim()) errors.name = "Укажите название организации";
  if (!/^\d{10}$/.test(String(form.get("inn") ?? ""))) errors.inn = "ИНН состоит из 10 цифр";
  return errors;
}

export default function InputInFormExample() {
  const [errors, setErrors] = React.useState<Errors>({});

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors(validate(new FormData(event.currentTarget)));
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.formHeader}>
        <Typography.Root as="h3" variant="title-m">
          Реквизиты компании
        </Typography.Root>
        <Typography.Root as="p" variant="body-s" tone="secondary">
          Используются в счетах и закрывающих документах.
        </Typography.Root>
      </div>
      <div className={styles.formFields}>
        <div className={styles.formWide}>
          <Input.Root label="Название организации" required error={errors.name}>
            <Input.Wrapper>
              <Input.Field
                name="name"
                defaultValue="ООО «Северный ветер»"
                autoComplete="organization"
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
        <Input.Root label="ИНН" required error={errors.inn} reserveSupportRow>
          <Input.Wrapper>
            <Input.Field name="inn" defaultValue="78123" inputMode="numeric" />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="КПП" optional reserveSupportRow>
          <Input.Wrapper>
            <Input.Field name="kpp" placeholder="9 цифр" inputMode="numeric" />
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.formWide}>
          <Input.Root label="Почта для счетов" hint="Сюда придут счета и акты">
            <Input.Wrapper>
              <Input.Field name="email" type="email" placeholder="buh@company.ru" />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
      <div className={styles.formActions}>
        <Button.Root variant="ghost" tone="neutral" type="reset" onClick={() => setErrors({})}>
          Отменить
        </Button.Root>
        <Button.Root type="submit">Сохранить</Button.Root>
      </div>
    </form>
  );
}
