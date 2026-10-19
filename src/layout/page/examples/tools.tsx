/** The orders page's tools in its top bar: sections with counts, the search and filter that narrow both views, the view, in the order written; the active filters on a line under everything — `Page.Tools`, `Page.Chips`. */
import {
  Button,
  Icon,
  Page,
  SegmentedControl,
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

const VIEWS = [
  { value: "list", label: "Список" },
  { value: "board", label: "Доска" },
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
  const [view, setView] = React.useState("list");
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
            <SegmentedControl.Root value={view} onValueChange={setView} aria-label="Вид">
              {VIEWS.map((item) => (
                <SegmentedControl.Item key={item.value} value={item.value}>
                  {item.label}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
          </Page.Tools>
          <Page.Actions>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Заказ
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
