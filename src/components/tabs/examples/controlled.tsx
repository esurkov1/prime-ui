/** Controlled tabs (`value` + `onValueChange`) with `Tabs.Count` counters. Use when the active tab lives in app state or the URL. */
import { Tabs, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const tabs = [
  { value: "new", label: "Новые", count: 12 },
  { value: "progress", label: "В работе", count: 5 },
  { value: "done", label: "Готово", count: 148 },
];

export default function TabsControlledExample() {
  const [value, setValue] = React.useState("new");
  const current = tabs.find((t) => t.value === value);

  return (
    <Tabs.Root value={value} onValueChange={setValue}>
      <Tabs.List aria-label="Заявки">
        {tabs.map((t) => (
          <Tabs.Trigger key={t.value} value={t.value}>
            <Tabs.Label>{t.label}</Tabs.Label>
            <Tabs.Count color={t.value === value ? "blue" : "gray"}>{t.count}</Tabs.Count>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((t) => (
        <Tabs.Panel key={t.value} value={t.value}>
          <Typography.Root variant="body-m" tone="secondary">
            Заявок в разделе «{current?.label}»:{" "}
            <Typography.Root as="span" variant="body-m" tone="muted" className={styles.count}>
              {current?.count}
            </Typography.Root>
          </Typography.Root>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
