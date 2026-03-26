import { Select } from "@/components/select/Select";

import styles from "./select-snippets.module.css";

export default function SelectFullWidthSnippet() {
  return (
    <div className={styles.fullWidthShell}>
      <Select.Root size="m" defaultValue="ship" placeholder="Способ доставки">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="pickup">Самовывоз</Select.Item>
          <Select.Item value="ship">Курьер</Select.Item>
          <Select.Item value="post">Почта</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
