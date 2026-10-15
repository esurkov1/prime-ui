/** The orders page's tools in its top bar: sections with counts, search and filter, the period, in the order written; the active filters on a line under everything — `Page.Tools`, `Page.Chips`. */
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
      <Page.Root>
        <Page.TopBar sticky={false}>
          <Page.Heading>
            <Page.Title>Заказы</Page.Title>
          </Page.Heading>
          <Page.Tools aria-label="Заказы">
            <SegmentedControl.Root value={section} onValueChange={setSection} aria-label="Раздел">
              {SECTIONS.map((item) => (
                <SegmentedControl.Item key={item.value} value={item.value}>
                  {item.label}
                  <SegmentedControl.Count>{item.count}</SegmentedControl.Count>
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
            <SmartFilter.Toolbar />
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
          </Page.Tools>
          <Page.Actions>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Новый заказ
            </Button.Root>
          </Page.Actions>
          <Page.Chips>
            <SmartFilter.Chips />
          </Page.Chips>
        </Page.TopBar>
      </Page.Root>
    </SmartFilter.Root>
  );
}
