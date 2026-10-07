/** The system select (native) built from the same Select.Item parts, with label and hint. Use it on mobile-first forms where the OS picker is preferable. */
import { Select } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SelectNativeExample() {
  return (
    <div className={styles.narrow}>
      <Select.Root
        native
        label="Тема оформления"
        hint="Системный список на мобильных"
        defaultValue="auto"
      >
        <Select.Item value="auto">Как в системе</Select.Item>
        <Select.Item value="light">Светлая</Select.Item>
        <Select.Item value="dark">Тёмная</Select.Item>
      </Select.Root>
    </div>
  );
}
