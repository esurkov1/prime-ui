/** The zoom owned by the page: presets in the toolbar and the built-in switch change one state — `scale`, `onScaleChange`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Button, Gantt, type GanttBar, type GanttScale } from "prime-ui-kit";
import * as React from "react";

type Phase = { id: string; name: string; bars: GanttBar[] };

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });
const at = (days: number) => addDays(WEEK, days);

const ROADMAP: Phase[] = [
  {
    id: "q-sales",
    name: "Отдел продаж",
    bars: [
      {
        id: "crm",
        label: "Внедрение CRM",
        start: at(-21),
        end: at(35),
        color: "blue",
        progress: 0.4,
      },
    ],
  },
  {
    id: "q-warehouse",
    name: "Склад",
    bars: [{ id: "wms", label: "Новая WMS", start: at(14), end: at(98), color: "teal" }],
  },
  {
    id: "q-finance",
    name: "Финансы",
    bars: [
      { id: "audit", label: "Годовой аудит", start: at(56), end: at(84), color: "orange" },
      { id: "report", label: "Отчёт совету", start: at(90), end: at(90), tone: "accent" },
    ],
  },
];

const PRESETS: { scale: GanttScale; label: string }[] = [
  { scale: "day", label: "Спринт" },
  { scale: "week", label: "Квартал" },
  { scale: "month", label: "Год" },
];

export default function GanttControlledExample() {
  const [scale, setScale] = React.useState<GanttScale>("week");

  return (
    <Gantt
      aria-label="Дорожная карта"
      scale={scale}
      onScaleChange={setScale}
      rows={ROADMAP}
      getRowKey={(phase) => phase.id}
      getRowLabel={(phase) => phase.name}
      getRowBars={(phase) => phase.bars}
      toolbar={PRESETS.map((preset) => (
        <Button.Root
          key={preset.scale}
          variant="ghost"
          tone="neutral"
          pressed={scale === preset.scale}
          onClick={() => setScale(preset.scale)}
        >
          {preset.label}
        </Button.Root>
      ))}
    />
  );
}
