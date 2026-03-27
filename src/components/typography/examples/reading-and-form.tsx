import { Button, Input, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

/**
 * Заголовок и вводный текст — `Typography`; поля и кнопки — `Input` / `Button`.
 * Зеркало `playground/snippets/typography/reading-and-form.tsx`.
 */
export default function TypographyExampleReadingAndForm() {
  return (
    <main className={styles.readingAndForm}>
      <Typography.Root as="h1" variant="heading-page">
        Заявка на доступ
      </Typography.Root>
      <Typography.Root as="p" variant="body-default" tone="muted">
        Заполните форму: роли текста задаются здесь, оформление полей — компонентами формы.
      </Typography.Root>
      <div className={styles.readingAndFormFields}>
        <Input.Root label="Email">
          <Input.Wrapper>
            <Input.Field type="email" placeholder="you@example.com" autoComplete="email" />
          </Input.Wrapper>
        </Input.Root>
        <Input.Root label="Комментарий" hint="Необязательно">
          <Input.Wrapper>
            <Input.Field placeholder="Контекст" />
          </Input.Wrapper>
        </Input.Root>
        <div className={styles.readingAndFormActions}>
          <Button.Root type="button" variant="primary">
            Отправить
          </Button.Root>
          <Button.Root type="button" variant="neutral" mode="stroke">
            Отмена
          </Button.Root>
        </div>
      </div>
    </main>
  );
}
