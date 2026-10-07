/** A task toolbar with search, a view switch, a period switch and an export button, all size m. Use it to compose segmented controls into a toolbar. */
import { CalendarDays, Columns3, List } from "lucide-react";
import { Button, IconDownload, IconSearch, Input, SegmentedControl } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function SegmentedControlToolbarExample() {
  return (
    <div className={styles.toolbar}>
      <Input.Root className={styles.toolbarSearch}>
        <Input.Wrapper>
          <Input.Icon side="start">
            <IconSearch />
          </Input.Icon>
          <Input.Field
            type="search"
            placeholder="Задача или исполнитель"
            aria-label="Поиск задач"
          />
        </Input.Wrapper>
      </Input.Root>
      <SegmentedControl.Root defaultValue="board" aria-label="Вид">
        <SegmentedControl.Item value="list">
          <SegmentedControl.Icon>
            <List />
          </SegmentedControl.Icon>
          Список
        </SegmentedControl.Item>
        <SegmentedControl.Item value="board">
          <SegmentedControl.Icon>
            <Columns3 />
          </SegmentedControl.Icon>
          Доска
        </SegmentedControl.Item>
        <SegmentedControl.Item value="calendar">
          <SegmentedControl.Icon>
            <CalendarDays />
          </SegmentedControl.Icon>
          Календарь
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <SegmentedControl.Root defaultValue="week" aria-label="Период">
        <SegmentedControl.Item value="day">День</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        <SegmentedControl.Item value="year">Год</SegmentedControl.Item>
      </SegmentedControl.Root>
      <Button.Root variant="outline" tone="neutral">
        <Button.Icon>
          <IconDownload />
        </Button.Icon>
        Экспорт
      </Button.Root>
    </div>
  );
}
