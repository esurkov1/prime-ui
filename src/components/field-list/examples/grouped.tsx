/** A rental bill kept in groups by type: a new line and a line whose type changes take their place in their group, and the rows below glide aside to make room — `value`, `onValueChange`, `createItem`. */
import { FieldList, type FieldListColumn, Input, Select } from "prime-ui-kit";
import * as React from "react";

type Line = { id: string; kind: string; item: string; amount: string };

const COLUMNS: FieldListColumn[] = [
  { label: "Тип", width: "m" },
  { label: "Позиция" },
  { label: "Сумма", width: "s" },
];

const KINDS = [
  { value: "term", label: "Срок" },
  { value: "delivery", label: "Доставка" },
  { value: "accessory", label: "Аксессуар" },
];

const KIND_ORDER = KINDS.map((kind) => kind.value);

const LINES: Line[] = [
  { id: "rent", kind: "term", item: "Аренда: 20 окт → 2 нояб", amount: "18 200" },
  { id: "delivery", kind: "delivery", item: "Доставка: Банг Тао", amount: "1 500" },
  { id: "helmet", kind: "accessory", item: "Шлем Full face", amount: "2 600" },
  { id: "phone", kind: "accessory", item: "Держатель телефона", amount: "400" },
];

/** The bill in its groups: terms, then delivery, then accessories; a stable order inside a group. */
function sortBill(lines: readonly Line[]): Line[] {
  return [...lines].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind));
}

export default function FieldListGroupedExample() {
  const [lines, setLines] = React.useState(LINES);

  return (
    <FieldList
      label="Счёт по аренде"
      columns={COLUMNS}
      value={lines}
      onValueChange={(next) => setLines(sortBill(next))}
      getId={(line) => line.id}
      getLabel={(line) => line.item}
      createItem={() => ({ id: crypto.randomUUID(), kind: "term", item: "Продление", amount: "" })}
      addLabel="Продление"
      renderItem={(line, row) => (
        <>
          <Select.Root value={line.kind} onValueChange={(kind) => row.update({ kind })}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {KINDS.map((kind) => (
                <Select.Item key={kind.value} value={kind.value}>
                  {kind.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
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
                placeholder="0"
                onChange={(event) => row.update({ amount: event.target.value })}
              />
              <Input.InlineAffix side="end">₽</Input.InlineAffix>
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
    />
  );
}
