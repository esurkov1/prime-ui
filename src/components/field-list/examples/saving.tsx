/** Removing a recipient is saved on the server: the row leaves at once and comes back with the reason if the server refuses — `onValueChange`, `error`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

type Recipient = { id: string; name: string; email: string; billing: boolean };

const COLUMNS: FieldListColumn[] = [{ label: "Имя" }, { label: "Почта" }];

const RECIPIENTS: Recipient[] = [
  { id: "accounting", name: "Бухгалтерия", email: "buh@severstroy.ru", billing: true },
  { id: "director", name: "Ирина Котова", email: "kotova@severstroy.ru", billing: false },
  { id: "manager", name: "Олег Демин", email: "demin@severstroy.ru", billing: false },
];

/** The server's answer to a removal, a beat later: the billing contact stays. */
function saveRemoval(removed: Recipient[]) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (removed.some((recipient) => recipient.billing)) {
        reject(new Error("Бухгалтерию нельзя убрать: на неё уходят счета"));
      } else {
        resolve();
      }
    }, 900);
  });
}

export default function FieldListSavingExample() {
  const [recipients, setRecipients] = React.useState(RECIPIENTS);
  const [failure, setFailure] = React.useState<string | null>(null);

  return (
    <FieldList
      label="Кому отправлять счета"
      error={failure}
      columns={COLUMNS}
      value={recipients}
      onValueChange={(next) => {
        setFailure(null);
        const removed = recipients.filter(
          (recipient) => !next.some((item) => item.id === recipient.id),
        );
        if (removed.length === 0) {
          setRecipients(next);
          return;
        }
        return saveRemoval(removed).then(
          () => setRecipients(next),
          (reason: Error) => {
            setFailure(reason.message);
            throw reason;
          },
        );
      }}
      getId={(recipient) => recipient.id}
      getLabel={(recipient) => recipient.name}
      createItem={() => ({ id: crypto.randomUUID(), name: "", email: "", billing: false })}
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
