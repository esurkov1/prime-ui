/** `sameMinWidthAsTrigger`: the menu is at least as wide as a full-width trigger. Use for full-width buttons in a column. */
import { Button, Dropdown } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function DropdownFullWidthExample() {
  return (
    <div className={styles.wideColumn}>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="soft" tone="neutral" fullWidth>
            Экспортировать отчёт
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content sameMinWidthAsTrigger>
          <Dropdown.Item>PDF</Dropdown.Item>
          <Dropdown.Item>Excel (.xlsx)</Dropdown.Item>
          <Dropdown.Item>CSV</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}
