/** Controlled value set from outside (preset buttons) and read back as ready-made lists with `resolveSmartFilterValues`: a hidden value of a fixed field becomes "all except" for the request. Use when filters come from a URL, a saved view or a server query. */
import {
  Button,
  resolveSmartFilterValues,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
  Typography,
} from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const FIELDS: SmartFilterField[] = [
  {
    key: "method",
    label: "Метод",
    options: METHODS.map((v) => ({ value: v, label: v })),
  },
];

export default function SmartFilterControlledExample() {
  const [value, setValue] = useState<SmartFilterValue>({});

  return (
    <div className={styles.stack}>
      <SmartFilter.Root fields={FIELDS} value={value} onValueChange={setValue}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>
      <div className={styles.presets}>
        <Button.Root
          variant="soft"
          tone="neutral"
          size="s"
          onClick={() => setValue({ method: { include: ["PUT"], exclude: [] } })}
        >
          Только PUT
        </Button.Root>
        <Button.Root
          variant="soft"
          tone="neutral"
          size="s"
          onClick={() => setValue({ method: { include: [], exclude: ["GET", "POST"] } })}
        >
          Без GET и POST
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral" size="s" onClick={() => setValue({})}>
          Сбросить
        </Button.Root>
      </div>
      <Typography.Root as="div" variant="code" className={styles.resolved}>
        {`method: ${JSON.stringify(resolveSmartFilterValues(value.method, METHODS))}`}
      </Typography.Root>
    </div>
  );
}
