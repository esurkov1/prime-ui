/** A nested record in the top bar: the path ending in the title, a line of data, the page's tools and its buttons — `Page.TopBar`, `Page.Heading`, `Page.Tools`, `Page.Actions`. */
import { Breadcrumb, Button, Icon, Input, Page, SegmentedControl } from "prime-ui-kit";
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

export default function PageTopBarExample() {
  const [section, setSection] = React.useState("all");
  const [view, setView] = React.useState("board");
  const [query, setQuery] = React.useState("");

  return (
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
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon side="start">
                <Icon name="action.search" tone="secondary" />
              </Input.Icon>
              <Input.Field
                type="search"
                aria-label="Поиск по задачам"
                placeholder="Поиск"
                value={query}
                onValueChange={setQuery}
              />
            </Input.Wrapper>
          </Input.Root>
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
          <Button.Root aria-label="Новая сделка">
            <Button.Icon>
              <Icon name="action.add" />
            </Button.Icon>
            Сделка
          </Button.Root>
        </Page.Actions>
      </Page.TopBar>
    </Page.Root>
  );
}
