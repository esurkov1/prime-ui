import * as React from "react";

import { Switch } from "@/components/switch/Switch";

export default function SwitchControlledSnippet() {
  const [on, setOn] = React.useState(false);

  return (
    <Switch.Root checked={on} onCheckedChange={setOn}>
      <Switch.Label>Рассылка: {on ? "включена" : "выключена"}</Switch.Label>
      <Switch.Hint>Состояние задаётся снаружи через checked и onCheckedChange</Switch.Hint>
    </Switch.Root>
  );
}
