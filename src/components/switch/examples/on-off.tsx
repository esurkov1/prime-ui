/** An off and an on switch with labels. Use it to check how the track reads on canvas, cards and floating layers. */
import { Switch } from "prime-ui-kit";

export default function SwitchOnOffExample() {
  return (
    <>
      <Switch.Root>
        <Switch.Label>Выключен</Switch.Label>
      </Switch.Root>
      <Switch.Root defaultChecked>
        <Switch.Label>Включён</Switch.Label>
      </Switch.Root>
    </>
  );
}
