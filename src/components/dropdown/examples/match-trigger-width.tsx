/** Under a full-width button the menu is at least as wide as the trigger — `matchTriggerWidth`. */
import { Button, Dropdown } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DropdownMatchTriggerWidthExample() {
  return (
    <div className={styles.column}>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="soft" tone="neutral" fullWidth>
            Экспортировать отчёт
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content matchTriggerWidth>
          <Dropdown.Item>PDF</Dropdown.Item>
          <Dropdown.Item>Excel (.xlsx)</Dropdown.Item>
          <Dropdown.Item>CSV</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}
