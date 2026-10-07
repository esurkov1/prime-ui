/** The parent owns the selection; «select all» turns indeterminate on a partial one — `checked`, `onCheckedChange`, `indeterminate`. */
import { Checkbox } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const DOCUMENTS = ["Договор поставки.pdf", "Счёт-фактура №418.pdf", "Акт сверки.xlsx"];

export default function CheckboxControlledExample() {
  const [selected, setSelected] = React.useState<string[]>([DOCUMENTS[0]]);
  const all = selected.length === DOCUMENTS.length;

  return (
    <div className={styles.list}>
      <Checkbox.Root
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? DOCUMENTS : [])}
      >
        <Checkbox.Label>
          Выбрать все ({selected.length} из {DOCUMENTS.length})
        </Checkbox.Label>
      </Checkbox.Root>
      <div className={styles.nested}>
        {DOCUMENTS.map((document) => (
          <Checkbox.Root
            key={document}
            checked={selected.includes(document)}
            onCheckedChange={(checked) =>
              setSelected((current) =>
                checked ? [...current, document] : current.filter((item) => item !== document),
              )
            }
          >
            <Checkbox.Label>{document}</Checkbox.Label>
          </Checkbox.Root>
        ))}
      </div>
    </div>
  );
}
