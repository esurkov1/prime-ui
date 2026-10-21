/** Every tier: one-lane rows from 28 to 52 px, bars, the head row and its selector, and the zoom presets of the tier — `size`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Gantt, type GanttBar, Typography } from "prime-ui-kit";

type Room = { id: string; name: string; bars: GanttBar[] };

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });
const at = (days: number) => addDays(WEEK, days);

const ROOMS: Room[] = [
  {
    id: "orion",
    name: "Переговорная «Орион»",
    bars: [{ id: "orion-1", label: "Стратсессия", start: at(1), end: at(3), color: "sky" }],
  },
  {
    id: "vega",
    name: "Переговорная «Вега»",
    bars: [{ id: "vega-1", label: "Обучение продаж", start: at(2), end: at(5), color: "orange" }],
  },
];

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function GanttSizesExample() {
  return (
    <div>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <Gantt
              aria-label={`Бронирования, ${size}`}
              size={size}
              defaultZoom="day"
              rows={ROOMS}
              getRowKey={(room) => room.id}
              getRowLabel={(room) => room.name}
              getRowBars={(room) => room.bars}
            />
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
