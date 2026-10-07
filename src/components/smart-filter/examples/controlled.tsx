/** A saved view sets the value from outside; the selection is read back as the list to ask the server for — `value`, `onValueChange`, `resolveSmartFilterValues`. */
import {
  Button,
  resolveSmartFilterValues,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const FIELDS: SmartFilterField[] = [
  { key: "method", label: "Метод", options: METHODS.map((v) => ({ value: v, label: v })) },
];

const ONLY_PUT: SmartFilterValue = { method: { include: ["PUT"], exclude: [] } };
const NO_READS: SmartFilterValue = { method: { include: [], exclude: ["GET", "POST"] } };

export default function SmartFilterControlledExample() {
  const [value, setValue] = React.useState<SmartFilterValue>({});

  return (
    <div className={styles.stack}>
      <SmartFilter.Root fields={FIELDS} value={value} onValueChange={setValue}>
        <SmartFilter.Toolbar />
        <SmartFilter.Chips />
      </SmartFilter.Root>
      <div className={styles.views}>
        <Button.Root variant="soft" tone="neutral" size="s" onClick={() => setValue(ONLY_PUT)}>
          Только PUT
        </Button.Root>
        <Button.Root variant="soft" tone="neutral" size="s" onClick={() => setValue(NO_READS)}>
          Без GET и POST
        </Button.Root>
        <Button.Root variant="ghost" tone="neutral" size="s" onClick={() => setValue({})}>
          Сбросить
        </Button.Root>
      </div>
      <Typography as="span" variant="code" tone="secondary">
        {`method: ${JSON.stringify(resolveSmartFilterValues(value.method, METHODS))}`}
      </Typography>
    </div>
  );
}
