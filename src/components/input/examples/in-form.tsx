/** Company details form: required fields checked on submit, each error leaves as its field is fixed and a saved form turns the button green; neighbours keep their bottoms aligned — `required`, `error`, `reserveSupportRow`. */
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
  const [saved, setSaved] = React.useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(new FormData(event.currentTarget));
    setErrors(next);
    setSaved(Object.keys(next).length === 0);
  };

  /** Editing a field takes its error away and makes the form unsaved again. */
  const edit = (field?: keyof Errors) => {
    setSaved(false);
    if (field) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <div className={styles.formHeader}>
        <Typography as="h3" variant="title-m">
          Реквизиты компании
        </Typography>
        <Typography as="p" variant="body-s" tone="secondary">
          Используются в счетах и закрывающих документах.
        </Typography>
      </div>
      <div className={styles.formFields}>
        <div className={styles.formWide}>
          <Input.Root label="Название организации" required error={errors.name}>
            <Input.Wrapper>
              <Input.Field
                name="name"
                onValueChange={() => edit("name")}
                defaultValue="ООО «Северный ветер»"
                autoComplete="organization"
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
        <Input.Root label="ИНН" required error={errors.inn} reserveSupportRow>
          <Input.Wrapper>
            <Input.Field
              name="inn"
              defaultValue="78123"
              inputMode="numeric"
              onValueChange={() => edit("inn")}
            />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="КПП" optional reserveSupportRow>
          <Input.Wrapper>
            <Input.Field
              name="kpp"
              placeholder="9 цифр"
              inputMode="numeric"
              onValueChange={() => edit()}
            />
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.formWide}>
          <Input.Root label="Почта для счетов" hint="Сюда придут счета и акты">
            <Input.Wrapper>
              <Input.Field
                name="email"
                type="email"
                placeholder="buh@company.ru"
                onValueChange={() => edit()}
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>
      <div className={styles.formActions}>
        <Button.Root
          variant="ghost"
          tone="neutral"
          type="reset"
          onClick={() => {
            setErrors({});
            setSaved(false);
          }}
        >
          Отменить
        </Button.Root>
        <Button.Root type="submit" tone={saved ? "success" : "accent"}>
          {saved ? "Сохранено" : "Сохранить"}
        </Button.Root>
      </div>
    </form>
  );
}
