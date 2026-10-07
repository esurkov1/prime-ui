/** A label and a counter on the first line, a metric on the second — `SegmentedControl.Label`, `SegmentedControl.Count`, `SegmentedControl.Description`. */
import { type PaletteColor, SegmentedControl } from "prime-ui-kit";

const QUEUES: {
  value: string;
  title: string;
  count: number;
  color: PaletteColor;
  metric: string;
}[] = [
  { value: "new", title: "Новые", count: 12, color: "blue", metric: "3 срочных" },
  { value: "progress", title: "В работе", count: 5, color: "orange", metric: "2 просрочены" },
  { value: "done", title: "Готово", count: 148, color: "green", metric: "31 за неделю" },
];

export default function SegmentedControlTwoLineExample() {
  return (
    <SegmentedControl.Root fullWidth defaultValue="new" aria-label="Очередь заявок">
      {QUEUES.map((queue) => (
        <SegmentedControl.Item key={queue.value} value={queue.value}>
          <SegmentedControl.Label>{queue.title}</SegmentedControl.Label>
          <SegmentedControl.Count color={queue.color}>{queue.count}</SegmentedControl.Count>
          <SegmentedControl.Description>{queue.metric}</SegmentedControl.Description>
        </SegmentedControl.Item>
      ))}
    </SegmentedControl.Root>
  );
}
