/** Contacts of a client checked on save: a field's problem shows under that field in its row, a problem of the whole list under the list, and focus goes to the first wrong field; a `*` after a heading marks a required column — `error`, `required`. */
import { Button, FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Contact = { id: string; role: string; phone: string };

const COLUMNS: FieldListColumn[] = [
  { label: "Должность", required: true },
  { label: "Телефон", width: "m", required: true },
];

const CONTACTS: Contact[] = [
  { id: "buyer", role: "Закупщик", phone: "+7 912 404-18-20" },
  { id: "lawyer", role: "Юрист", phone: "+7 912 40" },
];

const PHONE = /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/;

function phoneError(phone: string) {
  if (phone.trim() === "") return "Укажите телефон";
  return PHONE.test(phone) ? undefined : "Формат: +7 912 404-18-20";
}

export default function FieldListErrorsExample() {
  const [contacts, setContacts] = React.useState(CONTACTS);
  // Every save attempt validates the form; after it renders, focus goes to the first wrong field.
  const [attempts, setAttempts] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);
  const checked = attempts > 0;
  React.useEffect(() => {
    if (attempts === 0) return;
    formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [attempts]);
  const listError = checked && contacts.length === 0 ? "Добавьте хотя бы один контакт" : undefined;

  return (
    <form
      ref={formRef}
      noValidate
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        setAttempts((count) => count + 1);
      }}
    >
      <FieldList
        label="Контакты клиента"
        error={listError}
        columns={COLUMNS}
        value={contacts}
        onValueChange={setContacts}
        getId={(contact) => contact.id}
        getLabel={(contact) => contact.role}
        createItem={() => ({ id: crypto.randomUUID(), role: "", phone: "" })}
        addLabel="Добавить контакт"
        renderItem={(contact, row) => (
          <>
            <Input.Root
              error={checked && contact.role.trim() === "" ? "Укажите должность" : undefined}
            >
              <Input.Wrapper>
                <Input.Field
                  value={contact.role}
                  onChange={(event) => row.update({ role: event.target.value })}
                />
              </Input.Wrapper>
            </Input.Root>
            <Input.Root error={checked ? phoneError(contact.phone) : undefined}>
              <Input.Wrapper>
                <Input.Field
                  type="tel"
                  value={contact.phone}
                  placeholder="+7 912 404-18-20"
                  onChange={(event) => row.update({ phone: event.target.value })}
                />
              </Input.Wrapper>
            </Input.Root>
          </>
        )}
      />
      <Button.Root type="submit" className={styles.submit}>
        Сохранить контакты
      </Button.Root>
    </form>
  );
}
