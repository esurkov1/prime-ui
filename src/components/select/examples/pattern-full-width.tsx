import { Select } from "@/components/select/Select";

import styles from "./examples.module.css";

/** Narrow column shows trigger `width: 100%`; mirrors `playground/snippets/select/full-width.tsx`. */
export default function SelectPatternFullWidthExample() {
  return (
    <div className={styles.fullWidthShell}>
      <Select.Root size="m" defaultValue="ship" placeholder="Shipping method">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="pickup">Pickup</Select.Item>
          <Select.Item value="ship">Courier</Select.Item>
          <Select.Item value="post">Post</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
