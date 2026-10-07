/** A page heading and intro text set with Typography above a form built from Input and Button. Use for form pages: text roles come from Typography, fields from form components. */
import { Button, Input, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TypographyReadingAndFormExample() {
  return (
    <section className={styles.page} aria-labelledby="access-request-title">
      <Typography.Root id="access-request-title" as="h1" variant="heading-m">
        Заявка на доступ
      </Typography.Root>
      <Typography.Root as="p" variant="body-m" tone="secondary">
        Заполните форму: роли текста задаются здесь, оформление полей — компонентами формы.
      </Typography.Root>
      <div className={styles.form}>
        <Input.Root label="Email">
          <Input.Wrapper>
            <Input.Field type="email" placeholder="you@example.com" autoComplete="email" />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="Комментарий" optional>
          <Input.Wrapper>
            <Input.Field placeholder="Контекст" />
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.actions}>
          <Button.Root type="button">Отправить</Button.Root>
          <Button.Root variant="outline" tone="neutral" type="button">
            Отмена
          </Button.Root>
        </div>
      </div>
    </section>
  );
}
