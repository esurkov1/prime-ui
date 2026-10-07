/** The active tab lives in parent state, e.g. synced with the URL — `value`, `onValueChange`. */
import { Tabs, Typography } from "prime-ui-kit";
import * as React from "react";

const QUEUES = [
  { value: "new", label: "Новые", count: 12 },
  { value: "progress", label: "В работе", count: 5 },
  { value: "done", label: "Готово", count: 148 },
];

export default function TabsControlledExample() {
  const [queue, setQueue] = React.useState("new");

  return (
    <Tabs.Root value={queue} onValueChange={setQueue}>
      <Tabs.List aria-label="Заявки">
        {QUEUES.map((item) => (
          <Tabs.Item key={item.value} value={item.value}>
            <Tabs.Label>{item.label}</Tabs.Label>
            <Tabs.Count color={item.value === queue ? "blue" : "gray"}>{item.count}</Tabs.Count>
          </Tabs.Item>
        ))}
      </Tabs.List>
      {QUEUES.map((item) => (
        <Tabs.Panel key={item.value} value={item.value}>
          <Typography.Root variant="body-m" tone="secondary">
            Заявок в разделе «{item.label}»: {item.count}.
          </Typography.Root>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
