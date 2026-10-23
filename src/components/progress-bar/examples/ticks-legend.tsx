/** Leads by channel as ticks with a legend; another period moves one front and recolors the ticks — `variant`, `segments`, `legend`. */
import { ProgressBar, type ProgressSegment, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PERIODS = {
  week: [31, 14, 8, 6],
  month: [126, 52, 32, 24],
  quarter: [402, 121, 88, 132],
} as const;

const CHANNELS = [
  { label: "Сайт", color: "blue" },
  { label: "Email-рассылки", color: "purple" },
  { label: "Партнёры", color: "teal" },
] as const;

export default function ProgressBarTicksLegendExample() {
  const [period, setPeriod] = React.useState<keyof typeof PERIODS>("month");
  const [total, ...parts] = PERIODS[period];
  const segments: ProgressSegment[] = CHANNELS.map((channel, i) => ({
    ...channel,
    value: parts[i],
  }));

  return (
    <div className={styles.column}>
      <SegmentedControl.Root
        aria-label="Период"
        value={period}
        onValueChange={(next) => setPeriod(next as keyof typeof PERIODS)}
      >
        <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
        <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
        <SegmentedControl.Item value="quarter">Квартал</SegmentedControl.Item>
      </SegmentedControl.Root>
      <ProgressBar
        variant="ticks"
        size="xl"
        segments={segments}
        max={total}
        label={`Лиды по каналам: ${total}`}
        legend
      />
    </div>
  );
}
