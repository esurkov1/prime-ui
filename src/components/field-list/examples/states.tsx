/** The same list editable and disabled while the request saves it: fields, handles and buttons turn off together — `disabled`. */
import { FieldList, type FieldListColumn, Input } from "prime-ui-kit";

type Stage = { id: string; name: string; days: string };

const COLUMNS: FieldListColumn[] = [{ label: "Этап" }, { label: "Дней", width: "s" }];

const STAGES: Stage[] = [
  { id: "brief", name: "Бриф и смета", days: "3" },
  { id: "design", name: "Дизайн", days: "10" },
];

const STATES = [
  { label: "Этапы проекта", disabled: false },
  { label: "disabled", disabled: true },
];

export default function FieldListStatesExample() {
  return (
    <>
      {STATES.map((state) => (
        <FieldList
          key={state.label}
          label={state.label}
          disabled={state.disabled}
          reorderable
          columns={COLUMNS}
          defaultValue={STAGES}
          getId={(stage) => stage.id}
          getLabel={(stage) => stage.name}
          createItem={() => ({ id: crypto.randomUUID(), name: "", days: "" })}
          addLabel="Добавить этап"
          renderItem={(stage) => (
            <>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Field defaultValue={stage.name} />
                </Input.Wrapper>
              </Input.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Field defaultValue={stage.days} inputMode="numeric" />
                </Input.Wrapper>
              </Input.Root>
            </>
          )}
        />
      ))}
    </>
  );
}
