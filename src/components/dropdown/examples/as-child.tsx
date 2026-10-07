/** A text-link button as the trigger: any single element can open the menu. Use for inline sort / view switches in text. */
import { Dropdown, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DropdownAsChildExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <button type="button" className={styles.linkTrigger}>
          <Typography.Root as="span" variant="body-m" tone="accent" className={styles.underline}>
            Сортировка: по дате
          </Typography.Root>
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>По дате</Dropdown.Item>
        <Dropdown.Item>По названию</Dropdown.Item>
        <Dropdown.Item>По размеру</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
