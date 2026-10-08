/** A dashboard panel without search on a tablet-width column: the sections fill the top row, the period selector alone in the bottom row stretches to the full width — `PageToolbar.Sections`, `PageToolbar.View`. */
import { Icon, PageToolbar, SegmentedControl, Select } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const SECTIONS = [
  { value: "overview", label: "Обзор" },
  { value: "activity", label: "Активность" },
  { value: "resources", label: "Ресурсы" },
];

const PERIODS = [
  { value: "1h", label: "1 час" },
  { value: "24h", label: "24 часа" },
  { value: "7d", label: "7 дней" },
];

export default function PageToolbarWithoutSearchExample() {
  const [section, setSection] = React.useState("overview");
  const [period, setPeriod] = React.useState("24h");

  return (
    <div className={styles.tablet}>
      <PageToolbar.Root aria-label="Панель мониторинга">
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
      </PageToolbar.Root>
    </div>
  );
}
