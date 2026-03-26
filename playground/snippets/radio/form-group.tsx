import * as React from "react";
import { Button } from "@/components/button/Button";
import { Radio } from "@/components/radio/Radio";

import styles from "./radio-snippets.module.css";

export default function RadioFormGroupSnippet() {
  const [lastSubmit, setLastSubmit] = React.useState<string | null>(null);

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setLastSubmit(String(fd.get("slot") ?? ""));
      }}
    >
      <fieldset className={styles.fieldsetPlain}>
        <legend className={styles.legend}>Окно доставки</legend>
        <div className={styles.columnTight}>
          <Radio.Root name="slot" value="morning" defaultChecked size="m" required>
            <Radio.Label>09:00–12:00</Radio.Label>
          </Radio.Root>
          <Radio.Root name="slot" value="afternoon" size="m" required>
            <Radio.Label>12:00–16:00</Radio.Label>
          </Radio.Root>
          <Radio.Root name="slot" value="evening" size="m" required>
            <Radio.Label>16:00–20:00</Radio.Label>
          </Radio.Root>
        </div>
      </fieldset>
      <Button.Root type="submit" variant="primary" mode="filled" size="s">
        Сохранить слот
      </Button.Root>
      {lastSubmit ? <span className={styles.submitMeta}>Отправлено: {lastSubmit}</span> : null}
    </form>
  );
}
