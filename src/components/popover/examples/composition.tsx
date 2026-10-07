/** Report filters panel: header, full-width SegmentedControl, checkboxes and reset/apply actions. Use for filters and quick settings tied to one button. */
import { SlidersHorizontal } from "lucide-react";
import { Button, Checkbox, Popover, SegmentedControl } from "prime-ui-kit";

import preview from "./examples.module.css";

export default function PopoverCompositionExample() {
  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button.Root variant="soft" tone="neutral">
          <Button.Icon>
            <SlidersHorizontal />
          </Button.Icon>
          Фильтры
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className={preview.panelWidth} trapFocus>
        <Popover.Header>
          <Popover.Title>Фильтры отчёта</Popover.Title>
          <Popover.Description>Применяются ко всем графикам на странице.</Popover.Description>
        </Popover.Header>
        <SegmentedControl.Root defaultValue="month" fullWidth aria-label="Период">
          <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
          <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
          <SegmentedControl.Item value="year">Год</SegmentedControl.Item>
        </SegmentedControl.Root>
        <div className={preview.stack}>
          <Checkbox.Root defaultChecked>
            <Checkbox.Label>Только активные клиенты</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root>
            <Checkbox.Label>Скрыть нулевые строки</Checkbox.Label>
          </Checkbox.Root>
        </div>
        <Popover.Actions>
          <Button.Root variant="ghost" tone="neutral">
            Сбросить
          </Button.Root>
          <Button.Root>Применить</Button.Root>
        </Popover.Actions>
      </Popover.Content>
    </Popover.Root>
  );
}
