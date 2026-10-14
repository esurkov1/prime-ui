/** The invoice lines in a 320 px column: the headings give way, each row stacks its fields with their own labels and rows stand a group apart — `columns`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Line = { id: string; service: string; quantity: string; price: string };

const COLUMNS: FieldListColumn[] = [
  { label: "Услуга" },
  { label: "Кол-во", width: "s" },
  { label: "Цена", width: "m" },
];

const LINES: Line[] = [
  { id: "setup", service: "Внедрение CRM", quantity: "1", price: "180 000" },
  { id: "training", service: "Обучение менеджеров", quantity: "3", price: "15 000" },
];

export default function FieldListNarrowExample() {
  const [lines, setLines] = React.useState(LINES);

  return (
    <div className={styles.narrow}>
      <FieldList
        label="Позиции счёта"
        columns={COLUMNS}
        value={lines}
        onValueChange={setLines}
        getId={(line) => line.id}
        getLabel={(line) => line.service}
        createItem={() => ({ id: crypto.randomUUID(), service: "", quantity: "1", price: "" })}
        addLabel="Добавить позицию"
        renderItem={(line, row) => (
          <>
            <Input.Root>
              <Input.Wrapper>
                <Input.Field
                  value={line.service}
                  onChange={(event) => row.update({ service: event.target.value })}
                />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Field
                  value={line.quantity}
                  inputMode="numeric"
                  onChange={(event) => row.update({ quantity: event.target.value })}
                />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Field
                  value={line.price}
                  inputMode="decimal"
                  onChange={(event) => row.update({ price: event.target.value })}
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
