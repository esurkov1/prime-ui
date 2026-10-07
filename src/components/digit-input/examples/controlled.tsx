/** The parent owns the code (`value` + `onValueChange`), so a button can reset it. Use it when the code must be cleared or validated from outside. */
import { Button, DigitInput, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DigitInputControlledExample() {
  const [code, setCode] = React.useState("");

  return (
    <div className={styles.cell}>
      <DigitInput.Root
        length={4}
        value={code}
        onValueChange={setCode}
        labels={{ group: "PIN-код" }}
      />
      <Typography.Root variant="caption" tone="muted">
        Значение: {code.length > 0 ? code : "пусто"} ({code.length}/4)
      </Typography.Root>
      <Button.Root
        variant="ghost"
        tone="neutral"
        size="s"
        disabled={code.length === 0}
        onClick={() => setCode("")}
      >
        Очистить
      </Button.Root>
    </div>
  );
}
