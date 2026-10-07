/** Native form with `type="submit"` and `type="reset"` full-width buttons. Use in forms; the default `type="button"` never submits by accident. */
import { Button, Input } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function ButtonInFormExample() {
  return (
    <form
      className={styles.stack}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Input.Root label="Поиск">
        <Input.Wrapper>
          <Input.Field name="query" placeholder="Запрос" />
        </Input.Wrapper>
      </Input.Root>
      <Button.Root type="submit" fullWidth>
        Найти
      </Button.Root>
      <Button.Root variant="outline" tone="neutral" type="reset" fullWidth>
        Очистить
      </Button.Root>
    </form>
  );
}
