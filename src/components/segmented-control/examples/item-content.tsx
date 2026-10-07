/** Segment content: icon with text, icon-only square segments with aria-label and Tooltip, and a SegmentedControl.Count badge. Use it to pick what goes inside a segment. */
import { CalendarDays, Columns3, LayoutGrid, List } from "lucide-react";
import { IconMoon, IconSun, SegmentedControl, Tooltip, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const VIEWS = [
  { value: "list", label: "Списком", icon: List },
  { value: "grid", label: "Плиткой", icon: LayoutGrid },
  { value: "board", label: "Доской", icon: Columns3 },
  { value: "calendar", label: "Календарём", icon: CalendarDays },
] as const;

export default function SegmentedControlItemContentExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.cell}>
        <SegmentedControl.Root defaultValue="light" aria-label="Тема">
          <SegmentedControl.Item value="light">
            <SegmentedControl.Icon>
              <IconSun />
            </SegmentedControl.Icon>
            Светлая
          </SegmentedControl.Item>
          <SegmentedControl.Item value="dark">
            <SegmentedControl.Icon>
              <IconMoon />
            </SegmentedControl.Icon>
            Тёмная
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography.Root variant="caption" tone="muted">
          Иконка + текст
        </Typography.Root>
      </div>

      <div className={styles.cell}>
        <SegmentedControl.Root defaultValue="grid" aria-label="Вид списка">
          {VIEWS.map(({ value, label, icon: ViewIcon }) => (
            <Tooltip.Root key={value}>
              <Tooltip.Trigger>
                <SegmentedControl.Item value={value} aria-label={label}>
                  <SegmentedControl.Icon>
                    <ViewIcon />
                  </SegmentedControl.Icon>
                </SegmentedControl.Item>
              </Tooltip.Trigger>
              <Tooltip.Content>{label}</Tooltip.Content>
            </Tooltip.Root>
          ))}
        </SegmentedControl.Root>
        <Typography.Root variant="caption" tone="muted">
          Только иконки: квадратные сегменты
        </Typography.Root>
      </div>

      <div className={styles.cell}>
        <SegmentedControl.Root defaultValue="open" aria-label="Статус задач">
          <SegmentedControl.Item value="open">
            Открытые
            <SegmentedControl.Count color="blue">12</SegmentedControl.Count>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="review">
            На проверке
            <SegmentedControl.Count>3</SegmentedControl.Count>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="done">
            Готово
            <SegmentedControl.Count>148</SegmentedControl.Count>
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <Typography.Root variant="caption" tone="muted">
          Со счётчиком
        </Typography.Root>
      </div>
    </div>
  );
}
