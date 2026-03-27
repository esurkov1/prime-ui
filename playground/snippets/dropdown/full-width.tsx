import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";

import styles from "./dropdown-snippets.module.css";

/** `sameMinWidthAsTrigger`: минимальная ширина панели не меньше ширины триггера — длинные подписи не сжимают меню. */
export default function DropdownFullWidthSnippet() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root
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
