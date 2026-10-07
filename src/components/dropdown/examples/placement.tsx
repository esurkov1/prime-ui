/** `align` (start · center · end) and `side` (bottom · top). Near the viewport edge the panel flips and shifts automatically. */
import { Button, Dropdown } from "prime-ui-kit";
import styles from "./examples.module.css";

const PLACEMENTS = [
  { label: "Начало", align: "start", side: "bottom" },
  { label: "Центр", align: "center", side: "bottom" },
  { label: "Конец", align: "end", side: "bottom" },
  { label: "Сверху", align: "start", side: "top" },
] as const;

export default function DropdownPlacementExample() {
  return (
    <div className={styles.row}>
      {PLACEMENTS.map(({ label, align, side }) => (
        <Dropdown.Root key={label}>
          <Dropdown.Trigger>
            <Button.Root variant="soft" tone="neutral" size="s">
              {label}
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align={align} side={side}>
            <Dropdown.Item>Экспорт в PDF и печатная версия</Dropdown.Item>
            <Dropdown.Item>Дублировать в проект</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      ))}
    </div>
  );
}
