/** Selling points of a plan in the order of the pricing page: a one-column list has no headings and no numbers, the remove button is the last segment of each field, a point moves by its handle or Alt+arrows — `reorderable`, `getLabel`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

type Point = { id: string; text: string };

const COLUMNS: FieldListColumn[] = [{ label: "Преимущество" }];

const POINTS: Point[] = [
  { id: "users", text: "До 50 сотрудников в одном пространстве" },
  { id: "storage", text: "200 ГБ для документов и вложений" },
  { id: "support", text: "Поддержка в рабочие часы, ответ за 2 часа" },
  { id: "api", text: "Доступ к API и вебхукам" },
];

export default function FieldListReorderExample() {
  const [points, setPoints] = React.useState(POINTS);

  return (
    <FieldList
      label="Преимущества тарифа"
      columns={COLUMNS}
      reorderable
      value={points}
      onValueChange={setPoints}
      getId={(point) => point.id}
      getLabel={(point) => point.text}
      createItem={() => ({ id: crypto.randomUUID(), text: "" })}
      addLabel="Добавить преимущество"
      renderItem={(point, row) => (
        <Input.Root>
          <Input.Wrapper>
            <Input.Field
              value={point.text}
              onChange={(event) => row.update({ text: event.target.value })}
            />
          </Input.Wrapper>
        </Input.Root>
      )}
    />
  );
}
