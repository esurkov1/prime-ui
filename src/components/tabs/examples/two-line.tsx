/** Two-line tabs: `Tabs.Label` + `Tabs.Count` on the first line, `Tabs.Description` with a `<strong>` value on the second. Use for dashboard sections that need a summary per tab. */
import { type PaletteColor, Tabs, Typography } from "prime-ui-kit";
import { useState } from "react";

import styles from "./examples.module.css";

const sections: {
  value: string;
  title: string;
  count: number;
  color: PaletteColor;
  strong: string;
  rest: string;
}[] = [
  { value: "new", title: "Новые", count: 12, color: "blue", strong: "3", rest: " срочных" },
  {
    value: "progress",
    title: "В работе",
    count: 5,
    color: "orange",
    strong: "2",
    rest: " просрочены",
  },
  { value: "done", title: "Готово", count: 148, color: "green", strong: "31", rest: " за неделю" },
  {
    value: "returns",
    title: "Возвраты",
    count: 4,
    color: "red",
    strong: "1",
    rest: " ждёт решения",
  },
];

export default function TabsTwoLineExample() {
  const [value, setValue] = useState("new");

  return (
    <div className={styles.fleet}>
      <Tabs.Root value={value} onValueChange={setValue}>
        <Tabs.List aria-label="Заказы">
          {sections.map((s) => (
            <Tabs.Trigger key={s.value} value={s.value}>
              <Tabs.Label>{s.title}</Tabs.Label>
              <Tabs.Count color={s.color}>{s.count}</Tabs.Count>
              <Tabs.Description>
                <strong>{s.strong}</strong>
                {s.rest}
              </Tabs.Description>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {sections.map((s) => (
          <Tabs.Panel key={s.value} value={s.value}>
            <Typography.Root variant="body-m" tone="secondary">
              {s.title}: {s.count} заказов.
            </Typography.Root>
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
