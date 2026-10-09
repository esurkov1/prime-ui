/** A project plan: work streams with phases, progress and a launch milestone that move and stretch by pointer or keyboard — `getRowBars`, `onBarChange`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Gantt, type GanttBar, type GanttDates, Typography } from "prime-ui-kit";
import * as React from "react";

type Stream = { id: string; name: string; bars: GanttBar[] };

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });
const at = (days: number) => addDays(WEEK, days);

const PLAN: Stream[] = [
  {
    id: "research",
    name: "Исследование",
    bars: [
      { id: "interviews", label: "Интервью с клиентами", start: at(-14), end: at(-3), progress: 1 },
    ],
  },
  {
    id: "design",
    name: "Дизайн",
    bars: [
      { id: "prototype", label: "Прототип кабинета", start: at(-7), end: at(5), progress: 0.7 },
      { id: "ui-kit", label: "Макеты", start: at(5), end: at(19), color: "purple" },
    ],
  },
  {
    id: "backend",
    name: "Бэкенд",
    bars: [
      {
        id: "billing-api",
        label: "API счетов",
        start: at(0),
        end: at(18),
        color: "teal",
        progress: 0.3,
      },
    ],
  },
  {
    id: "frontend",
    name: "Фронтенд",
    bars: [{ id: "cabinet", label: "Личный кабинет", start: at(12), end: at(33), color: "orange" }],
  },
  {
    id: "launch",
    name: "Запуск",
    bars: [
      { id: "qa", label: "Тестирование", start: at(30), end: at(40), color: "green" },
      { id: "release", label: "Релиз 2.0", start: at(42), end: at(42), tone: "accent" },
    ],
  },
];

export default function GanttOverviewExample() {
  const [plan, setPlan] = React.useState(PLAN);

  const moveBar = (dates: GanttDates, bar: GanttBar) =>
    setPlan((streams) =>
      streams.map((stream) => ({
        ...stream,
        bars: stream.bars.map((item) => (item.id === bar.id ? { ...item, ...dates } : item)),
      })),
    );

  return (
    <Gantt
      aria-label="План проекта «Личный кабинет»"
      rows={plan}
      getRowKey={(stream) => stream.id}
      getRowLabel={(stream) => stream.name}
      getRowBars={(stream) => stream.bars}
      onBarChange={moveBar}
      toolbar={
        <Typography as="h3" variant="title-s">
          Личный кабинет 2.0
        </Typography>
      }
    />
  );
}
