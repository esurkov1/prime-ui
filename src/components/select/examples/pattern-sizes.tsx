import { Select } from "@/components/select/Select";

import styles from "./examples.module.css";

/** `size` ladder `s`–`xl`; mirrors `playground/snippets/select/sizes.tsx`. */
export default function SelectPatternSizesExample() {
  return (
    <div className={`${styles.stack} ${styles.stackNarrow}`}>
      <Select.Root size="s" placeholder="Size s">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
          <Select.Item value="c">C</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="m" placeholder="Size m">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
          <Select.Item value="c">C</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="l" placeholder="Size l">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
          <Select.Item value="b">B</Select.Item>
          <Select.Item value="c">C</Select.Item>
        </Select.Content>
      </Select.Root>
      <Select.Root size="xl" placeholder="Size xl">
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
