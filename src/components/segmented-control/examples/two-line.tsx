/** Two-line full-width segments with Label, Count and Description, scrolling on narrow screens. Use it for status overviews where each option carries a metric. */
import { type PaletteColor, SegmentedControl, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Group = {
  value: string;
  title: string;
  count: number;
  color: PaletteColor;
  description: React.ReactNode;
};

const groups: Group[] = [
  {
    value: "fleet",
    title: "В парке",
    count: 28,
    color: "blue",
    description: (
      <>
        <strong>1</strong> в подготовке
      </>
    ),
  },
  {
    value: "ready",
    title: "Готовы к выдаче",
    count: 7,
    color: "green",
    description: (
      <>
        ещё <strong>3</strong> в сервисе
      </>
    ),
  },
  {
    value: "rented",
    title: "В аренде",
    count: 17,
    color: "blue",
    description: (
      <>
        загрузка <strong>63%</strong>
      </>
    ),
  },
  {
    value: "releasing",
    title: "Освобождаются",
    count: 7,
    color: "orange",
    description: (
      <>
        ближайший <strong>завтра</strong>
      </>
    ),
  },
  {
    value: "service",
    title: "В сервисе",
    count: 4,
    color: "red",
    description: (
      <>
        <strong>2</strong> в ремонте
      </>
    ),
  },
  {
    value: "documents",
    title: "Документы",
    count: 25,
    color: "yellow",
    description: (
      <>
        <strong>10</strong> истекли
      </>
    ),
  },
  {
    value: "archive",
    title: "Архив",
    count: 1,
    color: "gray",
    description: (
      <>
        <strong>1</strong> продано
      </>
    ),
  },
];

export default function SegmentedControlTwoLineExample() {
  const [value, setValue] = React.useState("fleet");
  const current = groups.find((g) => g.value === value);

  return (
    <div className={styles.fleet}>
      <SegmentedControl.Root fullWidth value={value} onValueChange={setValue} aria-label="Автопарк">
        {groups.map((g) => (
          <SegmentedControl.Item key={g.value} value={g.value}>
            <SegmentedControl.Label>{g.title}</SegmentedControl.Label>
            <SegmentedControl.Count color={g.color}>{g.count}</SegmentedControl.Count>
            <SegmentedControl.Description>{g.description}</SegmentedControl.Description>
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Typography.Root variant="caption" tone="muted">
        {current?.title}: {current?.count} автомобилей.
      </Typography.Root>
    </div>
  );
}
