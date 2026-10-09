/** An enabled group next to a disabled one: every kit control inside takes its disabled look — `disabled`. */
import { Checkbox, Fieldset, Input, SegmentedControl, Typography } from "prime-ui-kit";

const STATES = [
  { caption: "default", disabled: false },
  { caption: "disabled", disabled: true },
];

export default function FieldsetStatesExample() {
  return (
    <div>
      {STATES.map((state) => (
        <div key={state.caption}>
          <Fieldset label="Сделка" disabled={state.disabled}>
            <Input.Root label="Название">
              <Input.Wrapper>
                <Input.Field defaultValue="Годовая лицензия, 40 мест" />
              </Input.Wrapper>
            </Input.Root>
            <SegmentedControl.Root label="Тип" defaultValue="new">
              <SegmentedControl.Item value="new">Новая</SegmentedControl.Item>
              <SegmentedControl.Item value="renewal">Продление</SegmentedControl.Item>
            </SegmentedControl.Root>
            <Checkbox.Root defaultChecked>
              <Checkbox.Label>Выставить счёт сразу</Checkbox.Label>
            </Checkbox.Root>
          </Fieldset>
          <Typography as="span" variant="caption" tone="muted">
            {state.caption}
          </Typography>
        </div>
      ))}
    </div>
  );
}
