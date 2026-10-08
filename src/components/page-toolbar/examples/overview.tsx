/** The panel of an orders page: sections with counts, filter and search, the period and the primary action in one row; active filters in a row under it — `PageToolbar.Sections`, `PageToolbar.Tools`, `PageToolbar.View`, `PageToolbar.Actions`, `PageToolbar.Chips`. */
import {
  Button,
  Icon,
  PageToolbar,
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

export default function PageToolbarOverviewExample() {
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
      <PageToolbar.Root aria-label="Заказы">
        <PageToolbar.Sections>
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
        </PageToolbar.Sections>
        <PageToolbar.Tools>
          <SmartFilter.Toolbar />
        </PageToolbar.Tools>
        <PageToolbar.View>
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
        </PageToolbar.View>
        <PageToolbar.Actions>
          <Button.Root>
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Новый заказ
          </Button.Root>
        </PageToolbar.Actions>
        <PageToolbar.Chips>
          <SmartFilter.Chips />
        </PageToolbar.Chips>
      </PageToolbar.Root>
    </SmartFilter.Root>
  );
}
