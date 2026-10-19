/** A plan price and its changes by month in one table: the base price is the first, pinned row whose remove button is off and says why, each change is a row with its month and its price, and the unit sits in the field, not in a heading — `getLocked`, `labels`, `width`. */
import { FieldList, type FieldListColumn, Input, Select } from "prime-ui-kit";
import * as React from "react";

type Period = { id: string; from: string; price: string; base?: boolean };

const COLUMNS: FieldListColumn[] = [{ label: "Действует" }, { label: "Цена за месяц", width: "m" }];

const MONTHS = [
  { value: "01", label: "С 1 января" },
  { value: "04", label: "С 1 апреля" },
  { value: "07", label: "С 1 июля" },
  { value: "10", label: "С 1 октября" },
];

const PERIODS: Period[] = [
  { id: "base", from: "", price: "4 900", base: true },
  { id: "q3", from: "07", price: "5 400" },
  { id: "q4", from: "10", price: "5 900" },
];

export default function FieldListBaseRowExample() {
  const [periods, setPeriods] = React.useState(PERIODS);

  return (
    <FieldList
      label="Цена тарифа"
      columns={COLUMNS}
      value={periods}
      onValueChange={setPeriods}
      getId={(period) => period.id}
      getLocked={(period) => period.base ?? false}
      labels={{ lockedReason: "Базовую цену нельзя удалить" }}
      createItem={() => ({ id: crypto.randomUUID(), from: "", price: "" })}
      addLabel="Изменение цены"
      renderItem={(period, row) => (
        <>
          {period.base ? (
            <Input.Root>
              <Input.Wrapper>
                <Input.Field value="Всегда, если нет изменений" readOnly />
              </Input.Wrapper>
            </Input.Root>
          ) : (
            <Select.Root
              value={period.from}
              onValueChange={(from) => row.update({ from })}
              placeholder="Выберите месяц"
            >
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {MONTHS.map((month) => (
                  <Select.Item key={month.value} value={month.value}>
                    {month.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={period.price}
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
