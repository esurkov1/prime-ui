/** Every tier: the headings, the fields, the handle and the buttons follow the list's size — `size`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";

type Contact = { id: string; name: string; phone: string };

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

const COLUMNS: FieldListColumn[] = [{ label: "Контакт" }, { label: "Телефон", width: "m" }];

const CONTACTS: Contact[] = [{ id: "buyer", name: "Анна Лебедева", phone: "+7 912 404-18-20" }];

export default function FieldListSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <FieldList
          key={size}
          size={size}
          label={size}
          columns={COLUMNS}
          defaultValue={CONTACTS}
          getId={(contact) => contact.id}
          getLabel={(contact) => contact.name}
          renderItem={(contact) => (
            <>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Field defaultValue={contact.name} />
                </Input.Wrapper>
              </Input.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Field type="tel" defaultValue={contact.phone} />
                </Input.Wrapper>
              </Input.Root>
            </>
          )}
        />
      ))}
    </>
  );
}
