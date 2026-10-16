/** The two looks of the same list: the rows on the host surface, or on a fill of their own with side padding — `variant`. */
import { FieldList, type FieldListColumn, Input, Typography } from "prime-ui-kit";

type Contact = { id: string; name: string; phone: string };

const VARIANTS = ["plain", "surface"] as const;

const COLUMNS: FieldListColumn[] = [{ label: "Контакт" }, { label: "Телефон", width: "m" }];

const CONTACTS: Contact[] = [
  { id: "buyer", name: "Анна Лебедева", phone: "+7 912 404-18-20" },
  { id: "accountant", name: "Олег Демин", phone: "+7 903 118-42-07" },
];

export default function FieldListVariantsExample() {
  return (
    <div>
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <div>
            <FieldList
              variant={variant}
              label="Контакты покупателя"
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
            <Typography as="span" variant="caption" tone="muted">
              {variant}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
