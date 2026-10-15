/** The panel of an orders page: search and filter, sections with counts, the period and the primary action in one row; active filters under the top row — `Page.ToolbarTools`, `Page.ToolbarSections`, `Page.ToolbarView`, `Page.ToolbarActions`, `Page.ToolbarChips`. */
import {
  Button,
  Icon,
  Page,
  SegmentedControl,
  Select,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
} from "prime-ui-kit";
import * as React from "react";

const SECTIONS = [
  { value: "all", label: "Все", count: 128 },
  { value: "active", label: "В работе", count: 12 },
  { value: "done", label: "Доставлены", count: 96 },
  { value: "cancelled", label: "Отменены", count: 20 },
];

const PERIODS = [
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "quarter", label: "Квартал" },
];

const FIELDS: SmartFilterField[] = [
  {
    key: "city",
    label: "Город",
    options: [
      { value: "msk", label: "Москва" },
      { value: "spb", label: "Санкт-Петербург" },
      { value: "kzn", label: "Казань" },
    ],
  },
  {
    key: "payment",
    label: "Оплата",
    options: [
      { value: "card", label: "Картой" },
      { value: "invoice", label: "По счёту" },
    ],
  },
];

export default function PageToolsExample() {
  const [section, setSection] = React.useState("all");
  const [period, setPeriod] = React.useState("30d");
  const [filter, setFilter] = React.useState<SmartFilterValue>({
    city: { include: ["msk"], exclude: [] },
  });
  const [search, setSearch] = React.useState("");

  return (
    <SmartFilter.Root
      fields={FIELDS}
      value={filter}
      onValueChange={setFilter}
      search={search}
      onSearchChange={setSearch}
    >
      <Page.Toolbar aria-label="Заказы">
        <Page.ToolbarTools>
          <SmartFilter.Toolbar />
        </Page.ToolbarTools>
        <Page.ToolbarSections>
          <SegmentedControl.Root
            fullWidth
            value={section}
            onValueChange={setSection}
            aria-label="Раздел"
          >
            {SECTIONS.map((item) => (
              <SegmentedControl.Item key={item.value} value={item.value}>
                {item.label}
                <SegmentedControl.Count>{item.count}</SegmentedControl.Count>
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </Page.ToolbarSections>
        <Page.ToolbarView>
          <Select.Root value={period} onValueChange={setPeriod}>
            <Select.Trigger aria-label="Период">
              <Select.TriggerIcon>
                <Icon name="field.calendar" />
              </Select.TriggerIcon>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {PERIODS.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Page.ToolbarView>
        <Page.ToolbarActions>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Новый заказ
          </Button.Root>
        </Page.ToolbarActions>
        <Page.ToolbarChips>
          <SmartFilter.Chips />
        </Page.ToolbarChips>
      </Page.Toolbar>
    </SmartFilter.Root>
  );
}
