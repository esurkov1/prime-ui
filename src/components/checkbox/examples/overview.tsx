/** A checkbox with its label; a click anywhere on the row toggles it. */
import { Checkbox } from "prime-ui-kit";

export default function CheckboxOverviewExample() {
  return (
    <Checkbox.Root defaultChecked>
      <Checkbox.Label>Присылать счета на почту</Checkbox.Label>
    </Checkbox.Root>
  );
}
