import { Select } from "@/components/select/Select";

import styles from "./select-snippets.module.css";

export default function SelectSizesSnippet() {
  return (
    <div className={`stack ${styles.stackNarrow}`}>
      <Select.Root size="s" placeholder="Размер s">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
          <Select.Item value="c">C</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="m" placeholder="Размер m">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
          <Select.Item value="c">C</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="l" placeholder="Размер l">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
          <Select.Item value="c">C</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="xl" placeholder="Размер xl">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
          <Select.Item value="c">C</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
