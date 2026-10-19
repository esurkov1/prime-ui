/** Recipients of invoice reminders, from one to three: the last row cannot be removed, the add button leaves once the list is full and the hint names the limit — `min`, `max`, `hint`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

type Recipient = { id: string; name: string; email: string };

const COLUMNS: FieldListColumn[] = [{ label: "Имя" }, { label: "Почта" }];

const RECIPIENTS: Recipient[] = [
  { id: "accounting", name: "Бухгалтерия", email: "buh@severstroy.ru" },
  { id: "director", name: "Ирина Котова", email: "kotova@severstroy.ru" },
  { id: "manager", name: "Олег Демин", email: "demin@severstroy.ru" },
];

export default function FieldListLimitsExample() {
  const [recipients, setRecipients] = React.useState(RECIPIENTS);

  return (
    <FieldList
      label="Кому напоминать об оплате"
      hint="Письмо уходит за три дня до срока, не больше трёх получателей."
      columns={COLUMNS}
      min={1}
      max={3}
      value={recipients}
      onValueChange={setRecipients}
      getId={(recipient) => recipient.id}
      getLabel={(recipient) => recipient.name}
      createItem={() => ({ id: crypto.randomUUID(), name: "", email: "" })}
      addLabel="Получатель"
      renderItem={(recipient, row) => (
        <>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={recipient.name}
                onChange={(event) => row.update({ name: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                type="email"
                value={recipient.email}
                placeholder="name@company.ru"
                onChange={(event) => row.update({ email: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
    />
  );
}
