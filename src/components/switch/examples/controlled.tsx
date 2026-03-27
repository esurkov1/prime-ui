import { Switch } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

/** Controlled `checked` / `onCheckedChange`; mirrors `playground/snippets/switch/controlled.tsx`. */
export default function SwitchControlledExample() {
  const [on, setOn] = React.useState(false);

  return (
    <div className={styles.stackDense}>
      <Switch.Root size="m" checked={on} onCheckedChange={setOn}>
        <Switch.Label>Рассылка: {on ? "включена" : "выключена"}</Switch.Label>
        <Switch.Hint>Состояние задаётся снаружи через checked и onCheckedChange</Switch.Hint>
      </Switch.Root>
    </div>
  );
}
