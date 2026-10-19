/** A deal bonus split between the team: the share takes a narrow column, and the totals row under the lines sums the shares and the amounts, each ending where its fields end their numbers — `renderTotals`, `width`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

type Share = { id: string; member: string; percent: string };

const BONUS = 240_000;

const COLUMNS: FieldListColumn[] = [
  { label: "Участник" },
  { label: "Доля", width: "xs" },
  { label: "Сумма", width: "m" },
];

const SHARES: Share[] = [
  { id: "sokolova", member: "Анна Соколова", percent: "50" },
  { id: "demin", member: "Олег Демин", percent: "30" },
  { id: "kotova", member: "Ирина Котова", percent: "20" },
];

const AMOUNT = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

const percentOf = (share: Share) => Number(share.percent.replace(",", ".")) || 0;

export default function FieldListTotalsExample() {
  const [shares, setShares] = React.useState(SHARES);

  return (
    <FieldList
      label="Бонус по сделке"
      hint="Доли в сумме дают 100 %."
      columns={COLUMNS}
      value={shares}
      onValueChange={setShares}
      getId={(share) => share.id}
      getLabel={(share) => share.member}
      createItem={() => ({ id: crypto.randomUUID(), member: "", percent: "" })}
      addLabel="Участник"
      renderItem={(share, row) => (
        <>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={share.member}
                onChange={(event) => row.update({ member: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={share.percent}
                inputMode="decimal"
                onChange={(event) => row.update({ percent: event.target.value })}
              />
              <Input.InlineAffix side="end">%</Input.InlineAffix>
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={AMOUNT.format((BONUS * percentOf(share)) / 100)}
                inputMode="decimal"
                readOnly
              />
              <Input.InlineAffix side="end">₽</Input.InlineAffix>
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
      renderTotals={(items) => {
        const percent = items.reduce((sum, share) => sum + percentOf(share), 0);
        return (
          <>
            {null}
            {`${percent} %`}
            {`${AMOUNT.format((BONUS * percent) / 100)} ₽`}
          </>
        );
      }}
    />
  );
}
