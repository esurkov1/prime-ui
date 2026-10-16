/** Payment stages of a project on a touch-first screen, where a drag is awkward: one more-button per row holds move up, move down and remove, the moves are off at the ends and next to the pinned advance, and Alt+arrows on the button move the row too — `rowActions`, `reorderable`, `getLocked`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

type Stage = { id: string; name: string; days: string; percent: string; pinned?: boolean };

const COLUMNS: FieldListColumn[] = [
  { label: "Этап" },
  { label: "Срок", width: "s" },
  { label: "Доля", width: "xs" },
];

const STAGES: Stage[] = [
  { id: "advance", name: "Аванс", days: "0", percent: "30", pinned: true },
  { id: "design", name: "Приёмка дизайна", days: "21", percent: "20" },
  { id: "beta", name: "Запуск бета-версии", days: "45", percent: "30" },
  { id: "release", name: "Подписание акта", days: "60", percent: "20" },
];

export default function FieldListRowMenuExample() {
  const [stages, setStages] = React.useState(STAGES);

  return (
    <FieldList
      label="Этапы оплаты"
      columns={COLUMNS}
      rowActions="menu"
      reorderable
      value={stages}
      onValueChange={setStages}
      getId={(stage) => stage.id}
      getLabel={(stage) => stage.name}
      getLocked={(stage) => stage.pinned ?? false}
      labels={{ lockedReason: "Аванс всегда первый" }}
      createItem={() => ({ id: crypto.randomUUID(), name: "", days: "", percent: "" })}
      addLabel="Добавить этап"
      renderItem={(stage, row) => (
        <>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={stage.name}
                onChange={(event) => row.update({ name: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={stage.days}
                inputMode="numeric"
                onChange={(event) => row.update({ days: event.target.value })}
              />
              <Input.InlineAffix side="end">дн.</Input.InlineAffix>
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={stage.percent}
                inputMode="decimal"
                onChange={(event) => row.update({ percent: event.target.value })}
              />
              <Input.InlineAffix side="end">%</Input.InlineAffix>
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
    />
  );
}
