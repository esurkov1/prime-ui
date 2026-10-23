/** A contact is created on the server, which gives it its id: a row of placeholders holds its place until the answer, the new row takes it with focus in its first field, and a refusal takes the placeholder away — `createItem`, `onValueChange`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";
import * as React from "react";

type Contact = { id: string; name: string; phone: string };

const COLUMNS: FieldListColumn[] = [{ label: "Имя" }, { label: "Телефон", width: "m" }];

const CONTACTS: Contact[] = [
  { id: "c-101", name: "Ирина Котова", phone: "+7 912 345-67-89" },
  { id: "c-102", name: "Олег Демин", phone: "+7 903 111-22-33" },
];

/** The server's answer a beat later: the id is its own. */
function createContact(): Promise<Contact> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: `c-${Date.now()}`, name: "", phone: "" }), 900);
  });
}

export default function FieldListCreatingExample() {
  const [contacts, setContacts] = React.useState(CONTACTS);

  return (
    <FieldList
      label="Контакты клиента"
      columns={COLUMNS}
      value={contacts}
      onValueChange={setContacts}
      getId={(contact) => contact.id}
      getLabel={(contact) => contact.name}
      createItem={createContact}
      addLabel="Контакт"
      renderItem={(contact, row) => (
        <>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                value={contact.name}
                onChange={(event) => row.update({ name: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Field
                type="tel"
                value={contact.phone}
                onChange={(event) => row.update({ phone: event.target.value })}
              />
            </Input.Wrapper>
          </Input.Root>
        </>
      )}
    />
  );
}
