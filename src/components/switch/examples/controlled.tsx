/** The parent owns the state and rewrites the hint to match it — `checked`, `onCheckedChange`. */
import { Switch } from "prime-ui-kit";
import * as React from "react";

export default function SwitchControlledExample() {
  const [digest, setDigest] = React.useState(false);

  return (
    <Switch.Root
      checked={digest}
      onCheckedChange={setDigest}
      hint={digest ? "Пришлём сводку в понедельник в 09:00" : "Сводка не приходит"}
    >
      <Switch.Label>Еженедельная сводка по продажам</Switch.Label>
    </Switch.Root>
  );
}
