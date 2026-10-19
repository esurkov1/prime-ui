/** The parent owns the lines: it sums them under the list and puts the saved lines back on reset — `value`, `onValueChange`. */
import { Button, FieldList, type FieldListColumn, Input, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Line = { id: string; service: string; amount: string };

const COLUMNS: FieldListColumn[] = [{ label: "Услуга" }, { label: "Сумма", width: "m" }];

const SAVED: Line[] = [
  { id: "license", service: "Лицензия на 12 месяцев", amount: "96 000" },
  { id: "migration", service: "Перенос данных", amount: "24 000" },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

function totalOf(lines: Line[]) {
  return lines.reduce((sum, line) => sum + (Number(line.amount.replace(/\s/g, "")) || 0), 0);
}

export default function FieldListControlledExample() {
  const [lines, setLines] = React.useState(SAVED);

  return (
    <div className={styles.stack}>
      <FieldList
        label="Состав сделки"
        columns={COLUMNS}
        value={lines}
        onValueChange={setLines}
        getId={(line) => line.id}
        getLabel={(line) => line.service}
        createItem={() => ({ id: crypto.randomUUID(), service: "", amount: "" })}
        addLabel="Услуга"
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
                  value={line.amount}
                  inputMode="decimal"
                  placeholder="0"
                  onChange={(event) => row.update({ amount: event.target.value })}
                />
                <Input.InlineAffix side="end">₽</Input.InlineAffix>
              </Input.Wrapper>
            </Input.Root>
          </>
        )}
      />
      <div className={styles.summary}>
        <Typography variant="title-m">Итого {RUB.format(totalOf(lines))}</Typography>
        <Button.Root variant="ghost" tone="neutral" onClick={() => setLines(SAVED)}>
          Вернуть сохранённое
        </Button.Root>
      </div>
    </div>
  );
}
