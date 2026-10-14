/** Lines of an invoice: the column headings stand once above the rows, each row has a remove button and the add button sits under them — `columns`, `renderItem`, `createItem`, `addLabel`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

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

export default function FieldListOverviewExample() {
  const [lines, setLines] = React.useState(LINES);

  return (
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
                placeholder="Поддержка, 1 месяц"
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
                placeholder="0"
                onChange={(event) => row.update({ price: event.target.value })}
              />
              <Input.InlineAffix side="end">₽</Input.InlineAffix>
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
    />
  );
}
