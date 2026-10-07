/** The parent owns the code and clears it with a button — `value`, `onValueChange`. */
import { Button, DigitInput } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

export default function DigitInputControlledExample() {
  const [code, setCode] = React.useState("73");

  return (
    <div className={styles.row}>
      <DigitInput label="PIN-код терминала" value={code} onValueChange={setCode} />
      <Button.Root
        variant="soft"
        tone="neutral"
        disabled={code.length === 0}
        onClick={() => setCode("")}
      >
        Очистить
      </Button.Root>
    </div>
  );
}
