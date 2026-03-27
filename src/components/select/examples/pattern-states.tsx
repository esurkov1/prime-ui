import { Select } from "@/components/select/Select";

import styles from "./examples.module.css";

/** Placeholder, `defaultValue`, root `disabled`, `hasError`; mirrors `playground/snippets/select/states.tsx`. */
export default function SelectPatternStatesExample() {
  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
      <Select.Root size="m" placeholder="Placeholder only">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b">Option B</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="m" defaultValue="b" placeholder="With default value">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b">Option B</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="m" defaultValue="on" disabled placeholder="Disabled">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="off">Off</Select.Item>
          <Select.Item value="on">On</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="m" hasError placeholder="Validation error">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="1">Item 1</Select.Item>
          <Select.Item value="2">Item 2</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
