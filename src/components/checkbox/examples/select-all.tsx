/** A controlled «select all» checkbox that turns indeterminate on a partial selection. Use it above lists and table rows with bulk actions. */

import { Checkbox } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const FILES = ["Договор.pdf", "Счёт-фактура.pdf", "Акт сверки.xlsx"];

export default function CheckboxSelectAllExample() {
  const [selected, setSelected] = React.useState<string[]>([FILES[0]]);

  const all = selected.length === FILES.length;
  const some = selected.length > 0 && !all;

  return (
    <div className={styles.list}>
      <Checkbox.Root
        onCheckedChange={(checked) => setSelected(checked ? FILES : [])}
        checked={all}
        indeterminate={some}
      >
        <Checkbox.Label>
          Выбрать все ({selected.length} из {FILES.length})
        </Checkbox.Label>
      </Checkbox.Root>
      {FILES.map((file) => (
        <Checkbox.Root
          onCheckedChange={(checked) =>
            setSelected((prev) => (checked ? [...prev, file] : prev.filter((f) => f !== file)))
          }
          key={file}
          checked={selected.includes(file)}
        >
          <Checkbox.Label>{file}</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </div>
  );
}
