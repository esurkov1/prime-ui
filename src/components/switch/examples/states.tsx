import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Off, on, disabled, read-only, error; mirrors `playground/snippets/switch/states.tsx`. */
export default function SwitchStatesExample() {
  return (
    <div className={styles.stack}>
      <Switch.Root size="m">
        <Switch.Label>Switch off</Switch.Label>
        <Switch.Hint>Switch hint</Switch.Hint>
      </Switch.Root>
      <Switch.Root size="m" defaultChecked>
        <Switch.Label>Switch on</Switch.Label>
        <Switch.Hint>Switch hint</Switch.Hint>
      </Switch.Root>
      <Switch.Root size="m" disabled>
        <Switch.Label>Switch disabled off</Switch.Label>
      </Switch.Root>
      <Switch.Root size="m" defaultChecked disabled>
        <Switch.Label>Switch disabled on</Switch.Label>
      </Switch.Root>
      <Switch.Root size="m" defaultChecked readOnly>
        <Switch.Label>Switch readonly on</Switch.Label>
      </Switch.Root>
      <Switch.Root size="m" variant="error">
        <Switch.Label>Switch error</Switch.Label>
        <Switch.Error>Switch error message</Switch.Error>
      </Switch.Root>
    </div>
  );
}
