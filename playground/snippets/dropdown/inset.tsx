import { Button } from "@/components/button/Button";
import { Dropdown } from "@/components/dropdown/Dropdown";
import { Typography } from "@/components/typography/Typography";

import styles from "./dropdown-snippets.module.css";

/** `Dropdown.Inset`: внутренние поля и вертикальный зазор между прямыми дочерними блоками (`padding`, `gap`). */
export default function DropdownInsetSnippet() {
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            С отступами по умолчанию
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Inset>
            <Typography.Root as="div" size="xs" tone="muted">
              Короткая заметка над списком.
            </Typography.Root>
            <Dropdown.Item>Первый пункт</Dropdown.Item>
            <Dropdown.Item>Второй пункт</Dropdown.Item>
          </Dropdown.Inset>
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root size="m" variant="neutral" mode="stroke">
            Плотная вставка
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Inset padding="none" gap="x2">
            <Typography.Root as="div" size="xs" tone="muted" className={styles.insetNoteTight}>
              Без внешнего inset-padding, меньший gap.
            </Typography.Root>
            <Dropdown.Item>Действие A</Dropdown.Item>
            <Dropdown.Item>Действие B</Dropdown.Item>
          </Dropdown.Inset>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  );
}
