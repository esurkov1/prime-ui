/** A setting that applies at once, with a hint under its text — `hint`. */
import { Switch } from "prime-ui-kit";

export default function SwitchOverviewExample() {
  return (
    <Switch.Root defaultChecked hint="Каждую ночь в 03:00 по Москве">
      <Switch.Label>Резервное копирование</Switch.Label>
    </Switch.Root>
  );
}
