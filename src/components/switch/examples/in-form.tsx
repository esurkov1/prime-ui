/** How Switch behaves inside a <form>: name goes to FormData, required is validated by the browser, a switch without text is named via aria-label. Prefer Checkbox when the value applies only after submit. */
import { Button, Switch, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function SwitchInFormExample() {
  const [result, setResult] = React.useState<string | null>(null);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const on = ["news", "terms", "beta"].filter((key) => data.get(key) === "on");
        setResult(`Включено: ${on.join(", ") || "ничего"}`);
      }}
    >
      <Switch.Root name="news" defaultChecked>
        <Switch.Label>Новости продукта</Switch.Label>
      </Switch.Root>
      <Switch.Root name="terms" required>
        <Switch.Label>Принимаю условия сервиса</Switch.Label>
        <Switch.Hint>Обязательно: без него форма не отправится.</Switch.Hint>
      </Switch.Root>
      <Switch.Root name="beta" aria-label="Бета-функции">
        <Switch.Label />
      </Switch.Root>
      <Button.Root type="submit">Сохранить</Button.Root>
      {result != null ? (
        <Typography.Root variant="caption" tone="muted">
          {result}
        </Typography.Root>
      ) : null}
    </form>
  );
}
