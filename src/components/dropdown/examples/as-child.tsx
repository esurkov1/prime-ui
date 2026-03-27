import { Dropdown } from "@/components/dropdown/Dropdown";

import styles from "./dropdown-examples.module.css";

/** Триггер как единственный ребёнок: aria и клик сливаются с ссылкой — как в `playground/snippets/dropdown/as-child.tsx`. */
export default function DropdownAsChildExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <a
          href="/playground"
          className={styles.linkTrigger}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Открыть как ссылка-триггер
        </a>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item>Пункт 1</Dropdown.Item>
        <Dropdown.Item>Пункт 2</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
