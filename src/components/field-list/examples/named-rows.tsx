/** A rental bill in a 320 px column whose lines name themselves: each line keeps its item and its remove button on the first line and its amount under it, with no labels, while every field is still named by its column — `stackedLabels`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Line = { id: string; item: string; amount: string };

const COLUMNS: FieldListColumn[] = [{ label: "Позиция" }, { label: "Сумма", width: "s" }];

const LINES: Line[] = [
  { id: "rent", item: "Аренда: 20 окт → 2 нояб", amount: "18 200" },
  { id: "delivery", item: "Доставка: Банг Тао", amount: "1 500" },
  { id: "helmet", item: "Аксессуар: шлем Full face", amount: "2 600" },
];

export default function FieldListNamedRowsExample() {
  const [lines, setLines] = React.useState(LINES);

  return (
    <div className={styles.narrow}>
      <FieldList
        label="Счёт по аренде"
        columns={COLUMNS}
        stackedLabels={false}
        value={lines}
        onValueChange={setLines}
        getId={(line) => line.id}
        getLabel={(line) => line.item}
        createItem={() => ({ id: crypto.randomUUID(), item: "", amount: "" })}
        addLabel="Позиция"
        renderItem={(line, row) => (
          <>
            <Input.Root>
              <Input.Wrapper>
                <Input.Field
                  value={line.item}
                  onChange={(event) => row.update({ item: event.target.value })}
                />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Field
                  value={line.amount}
                  inputMode="decimal"
                  onChange={(event) => row.update({ amount: event.target.value })}
                />
                <Input.InlineAffix side="end">₽</Input.InlineAffix>
              </Input.Wrapper>
            </Input.Root>
          </>
        )}
      />
    </div>
  );
}
