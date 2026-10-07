/** Sign-in card: a link inside text, a link next to a Button of the same size and neutral `s` service links. Use as the pattern for mixing links and actions in one block. */
import { Button, LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function LinkButtonCompositionExample() {
  return (
    <div className={styles.card}>
      <Typography.Root variant="body-m" tone="secondary">
        Ссылка для входа отправлена на почту. Не пришло письмо?{" "}
        <LinkButton.Root href="#">Отправить ещё раз</LinkButton.Root>
      </Typography.Root>
      <div className={styles.between}>
        <LinkButton.Root href="#">Войти по паролю</LinkButton.Root>
        <Button.Root>Продолжить</Button.Root>
      </div>
      <nav aria-label="Служебные ссылки" className={styles.footer}>
        <LinkButton.Root href="#" tone="neutral" size="s">
          Условия
        </LinkButton.Root>
        <LinkButton.Root href="#" tone="neutral" size="s">
          Конфиденциальность
        </LinkButton.Root>
        <LinkButton.Root href="#" tone="neutral" size="s">
          Помощь
        </LinkButton.Root>
      </nav>
    </div>
  );
}
