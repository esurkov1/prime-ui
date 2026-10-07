/** A settings form in a card: required and optional fields, an error that does not shift the row, actions at the end. Use it as the spacing reference for forms (field → field 20, group → actions 32). */
import { Button, Input, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function InputInFormExample() {
  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
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
          <Input.Root label="Название организации" required>
            <Input.Wrapper>
              <Input.Field defaultValue="ООО «Северный ветер»" autoComplete="organization" />
            </Input.Wrapper>
          </Input.Root>
        </div>
        <Input.Root label="ИНН" required error="ИНН состоит из 10 цифр" reserveSupportRow>
          <Input.Wrapper>
            <Input.Field defaultValue="78123" inputMode="numeric" />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="КПП" optional reserveSupportRow>
          <Input.Wrapper>
            <Input.Field placeholder="9 цифр" inputMode="numeric" />
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.formWide}>
          <Input.Root label="Email для счетов" hint="Сюда придут счета и акты">
            <Input.Wrapper>
              <Input.Field type="email" placeholder="buh@company.ru" />
            </Input.Wrapper>
          </Input.Root>
        </div>
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
