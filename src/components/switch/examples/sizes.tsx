import { Switch } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Ladder `s`–`xl`; mirrors `playground/snippets/switch/sizes.tsx`. */
export default function SwitchSizesExample() {
  return (
    <div className={styles.stack}>
      <Switch.Root size="s" defaultChecked>
        <Switch.Label>Switch s</Switch.Label>
      </Switch.Root>
      <Switch.Root size="m" defaultChecked>
        <Switch.Label>Switch m</Switch.Label>
      </Switch.Root>
      <Switch.Root size="l" defaultChecked>
        <Switch.Label>Switch l</Switch.Label>
      </Switch.Root>
      <Switch.Root size="xl" defaultChecked>
        <Switch.Label>Switch xl</Switch.Label>
      </Switch.Root>
    </div>
  );
}
