/** A controlled switch whose hint follows the state via checked and onCheckedChange. Use it when other UI depends on the switch. */

import { Switch } from "prime-ui-kit";
import * as React from "react";

export default function SwitchControlledExample() {
  const [on, setOn] = React.useState(false);

  return (
    <Switch.Root checked={on} onCheckedChange={setOn}>
      <Switch.Label>Рассылка о скидках</Switch.Label>
      <Switch.Hint>{on ? "Будем писать раз в неделю." : "Письма не приходят."}</Switch.Hint>
    </Switch.Root>
  );
}
