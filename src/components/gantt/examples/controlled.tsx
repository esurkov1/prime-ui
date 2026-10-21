/** The zoom owned by the page: its presets, the selector and a pinch change one state — `zoom`, `onZoomChange`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Button, Gantt, type GanttBar, type GanttZoom } from "prime-ui-kit";
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

const PRESETS: { zoom: GanttZoom; label: string }[] = [
  { zoom: "day", label: "Спринт" },
  { zoom: "week", label: "Квартал" },
  { zoom: "month", label: "Год" },
];

export default function GanttControlledExample() {
  const [zoom, setZoom] = React.useState<GanttZoom>("week");

  return (
    <Gantt
      aria-label="Дорожная карта"
      zoom={zoom}
      onZoomChange={setZoom}
      rows={ROADMAP}
      getRowKey={(phase) => phase.id}
      getRowLabel={(phase) => phase.name}
      getRowBars={(phase) => phase.bars}
      toolbar={PRESETS.map((preset) => (
        <Button.Root
          key={preset.label}
          variant="soft"
          tone="neutral"
          pressed={zoom === preset.zoom}
          onClick={() => setZoom(preset.zoom)}
        >
          {preset.label}
        </Button.Root>
      ))}
    />
  );
}
