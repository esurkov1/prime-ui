import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

import styles from "./dropdown-examples.module.css";

/** `sameMinWidthAsTrigger` — как в `playground/snippets/dropdown/full-width.tsx`. */
export default function DropdownFullWidthExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root
          type="button"
          size="m"
          variant="neutral"
          mode="stroke"
          aria-label="Действия со строкой"
          className={styles.iconTriggerMin}
        >
          ⋮
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content sameMinWidthAsTrigger>
        <Dropdown.Item>Очень длинная подпись пункта меню в одну строку</Dropdown.Item>
        <Dropdown.Item>Второй пункт</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
