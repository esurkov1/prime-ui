/** A nested record in the top bar: the path, the record as the page title with its line of data, its actions at the end, the page's tools as the second row — `Page.TopBar`, `Page.Toolbar`. */
import { Breadcrumb, Button, Icon, Page, SegmentedControl, Select } from "prime-ui-kit";
import * as React from "react";

const SECTIONS = [
  { value: "deals", label: "Сделки" },
  { value: "contacts", label: "Контакты" },
  { value: "documents", label: "Документы" },
];

const PERIODS = [
  { value: "month", label: "Октябрь" },
  { value: "quarter", label: "IV квартал" },
  { value: "year", label: "2026 год" },
];

export default function PageTopBarExample() {
  const [section, setSection] = React.useState("deals");
  const [period, setPeriod] = React.useState("month");

  return (
    <Page.Root>
      <Page.TopBar sticky={false}>
        <Page.Header>
          <Breadcrumb.Root>
            <Breadcrumb.Item href="#crm">CRM</Breadcrumb.Item>
            <Breadcrumb.Item href="#clients">Клиенты</Breadcrumb.Item>
          </Breadcrumb.Root>
          <Page.Title>ООО «Север»</Page.Title>
          <Page.Description>Клиент с 2021 года · 4 сделки</Page.Description>
          <Page.Actions>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.send" />
              </Button.Icon>
              Написать
            </Button.Root>
            <Button.Root>
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Новая сделка
            </Button.Root>
          </Page.Actions>
        </Page.Header>
        <Page.Toolbar aria-label="ООО «Север»">
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
        </Page.Toolbar>
      </Page.TopBar>
    </Page.Root>
  );
}
