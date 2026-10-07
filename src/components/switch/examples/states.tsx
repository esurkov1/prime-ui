/** Every state side by side, each labelled by its prop — `checked`, `readOnly`, `invalid`, `disabled`. */
import { Switch } from "prime-ui-kit";

export default function SwitchStatesExample() {
  return (
    <div>
      <div>
        <Switch.Root>
          <Switch.Label>unchecked</Switch.Label>
        </Switch.Root>
        <Switch.Root defaultChecked>
          <Switch.Label>checked</Switch.Label>
        </Switch.Root>
        <Switch.Root defaultChecked readOnly>
          <Switch.Label>readOnly</Switch.Label>
        </Switch.Root>
        <Switch.Root invalid>
          <Switch.Label>invalid</Switch.Label>
        </Switch.Root>
      </div>
      <div>
        <Switch.Root disabled>
          <Switch.Label>disabled</Switch.Label>
        </Switch.Root>
        <Switch.Root disabled defaultChecked>
          <Switch.Label>disabled · checked</Switch.Label>
        </Switch.Root>
      </div>
    </div>
  );
}
