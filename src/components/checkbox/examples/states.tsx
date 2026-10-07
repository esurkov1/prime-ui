/** Every state side by side, each labelled by its prop — `checked`, `indeterminate`, `invalid`, `disabled`. */
import { Checkbox } from "prime-ui-kit";

export default function CheckboxStatesExample() {
  return (
    <div>
      <div>
        <Checkbox.Root>
          <Checkbox.Label>unchecked</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root defaultChecked>
          <Checkbox.Label>checked</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root indeterminate>
          <Checkbox.Label>indeterminate</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root invalid>
          <Checkbox.Label>invalid</Checkbox.Label>
        </Checkbox.Root>
      </div>
      <div>
        <Checkbox.Root disabled>
          <Checkbox.Label>disabled</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root disabled defaultChecked>
          <Checkbox.Label>disabled · checked</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root disabled indeterminate>
          <Checkbox.Label>disabled · indeterminate</Checkbox.Label>
        </Checkbox.Root>
      </div>
    </div>
  );
}
