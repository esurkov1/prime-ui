/** A label and a counter on the first line, a summary on the second — `Tabs.Count`, `Tabs.Description`. */
import { type PaletteColor, Tabs, Typography } from "prime-ui-kit";

const SECTIONS: {
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
  return (
    <Tabs.Root defaultValue="new">
      <Tabs.List aria-label="Заказы">
        {SECTIONS.map((section) => (
          <Tabs.Item key={section.value} value={section.value}>
            <Tabs.Label>{section.title}</Tabs.Label>
            <Tabs.Count color={section.color}>{section.count}</Tabs.Count>
            <Tabs.Description>
              <strong>{section.strong}</strong>
              {section.rest}
            </Tabs.Description>
          </Tabs.Item>
        ))}
      </Tabs.List>
      {SECTIONS.map((section) => (
        <Tabs.Panel key={section.value} value={section.value}>
          <Typography.Root variant="body-m" tone="secondary">
            {section.title}: {section.count} заказов.
          </Typography.Root>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
