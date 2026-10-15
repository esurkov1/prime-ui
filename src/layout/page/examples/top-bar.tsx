/** A nested record in the top bar: the path ending in the title, a line of data, the page's tools, its buttons and the active filters — `Page.TopBar`, `Page.Heading`, `Page.Tools`, `Page.Actions`, `Page.Chips`. */
import {
  Breadcrumb,
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
  { value: "all", label: "Все" },
  { value: "mine", label: "Мои" },
  { value: "overdue", label: "Просрочены" },
];

const VIEWS = [
  { value: "board", label: "Доска" },
  { value: "list", label: "Список" },
];

const FIELDS: SmartFilterField[] = [
  {
    key: "owner",
    label: "Ответственный",
    options: [
      { value: "anna", label: "Анна К." },
      { value: "ivan", label: "Иван П." },
    ],
  },
];

export default function PageTopBarExample() {
  const [section, setSection] = React.useState("all");
  const [view, setView] = React.useState("board");
  const [filter, setFilter] = React.useState<SmartFilterValue>({
    owner: { include: ["anna"], exclude: [] },
  });

  return (
    <SmartFilter.Root fields={FIELDS} value={filter} onValueChange={setFilter}>
      <Page.Root>
        <Page.TopBar sticky={false}>
          <Page.Heading>
            <Breadcrumb.Root>
              <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
              <Breadcrumb.Item href="#north">ООО «Север»</Breadcrumb.Item>
            </Breadcrumb.Root>
            <Page.Title>Сделка № 2026-418</Page.Title>
            <Page.Description>7 в работе · 6,5 млн ₽ · обновлено 9:40</Page.Description>
          </Page.Heading>
          <Page.Tools aria-label="Сделка № 2026-418">
            <SegmentedControl.Root value={section} onValueChange={setSection} aria-label="Раздел">
              {SECTIONS.map((item) => (
                <SegmentedControl.Item key={item.value} value={item.value}>
                  {item.label}
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
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.forward" />
              </Button.Icon>
              Поделиться
            </Button.Root>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.download" />
              </Button.Icon>
              Экспорт
            </Button.Root>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Новая сделка
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
