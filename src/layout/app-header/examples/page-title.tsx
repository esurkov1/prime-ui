/** The header carries the page: the title is the page heading, the page tools (sections, the period, the primary action) are its second row and lay themselves out from its width — `AppHeader.Title`, `as`, `AppHeader.Tools`. */
import { AppHeader, Button, Icon, PageToolbar, SegmentedControl, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SECTIONS = [
  { value: "all", label: "Все" },
  { value: "mine", label: "Мои" },
  { value: "overdue", label: "Просроченные" },
];

const PERIODS = [
  { value: "month", label: "Октябрь" },
  { value: "quarter", label: "IV квартал" },
  { value: "year", label: "2026 год" },
];

export default function AppHeaderPageTitleExample() {
  const [section, setSection] = React.useState("all");
  const [period, setPeriod] = React.useState("month");

  return (
    <div className={styles.window}>
      <AppHeader.Root>
        <AppHeader.Start>
          <AppHeader.Title as="h1">
            Сделки
            <AppHeader.Description>Отдел продаж</AppHeader.Description>
          </AppHeader.Title>
        </AppHeader.Start>
        <AppHeader.Actions>
          <Button.Root variant="soft" tone="neutral" aria-label="Уведомления">
            <Button.Icon>
              <Icon name="object.bell" />
            </Button.Icon>
          </Button.Root>
        </AppHeader.Actions>
        <AppHeader.Tools>
          <PageToolbar.Root aria-label="Сделки">
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
                  </SegmentedControl.Item>
                ))}
              </SegmentedControl.Root>
            </PageToolbar.Sections>
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
                Новая сделка
              </Button.Root>
            </PageToolbar.Actions>
          </PageToolbar.Root>
        </AppHeader.Tools>
      </AppHeader.Root>
    </div>
  );
}
