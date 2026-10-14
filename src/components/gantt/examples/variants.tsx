/** Bars colored by category with palette hues, and by status with tones that win over the hue — `color`, `tone`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Gantt, type GanttBar, Typography } from "prime-ui-kit";

type Row = { id: string; name: string; bars: GanttBar[] };

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });
const at = (days: number) => addDays(WEEK, days);

const BY_PROJECT: Row[] = [
  {
    id: "crm",
    name: "CRM для дилеров",
    bars: [{ id: "crm-1", label: "Интеграция с 1С", start: at(-3), end: at(11), color: "blue" }],
  },
  {
    id: "portal",
    name: "Портал поставщиков",
    bars: [{ id: "portal-1", label: "Каталог", start: at(2), end: at(16), color: "teal" }],
  },
  {
    id: "mobile",
    name: "Мобильное приложение",
    bars: [{ id: "mobile-1", label: "Онбординг", start: at(-1), end: at(9), color: "pink" }],
  },
];

const BY_STATUS: Row[] = [
  {
    id: "done",
    name: "Готово",
    bars: [{ id: "s-1", label: "Договор подписан", start: at(-10), end: at(-2), tone: "success" }],
  },
  {
    id: "risk",
    name: "Под угрозой",
    bars: [{ id: "s-2", label: "Миграция данных", start: at(-2), end: at(12), tone: "warning" }],
  },
  {
    id: "late",
    name: "Просрочено",
    bars: [{ id: "s-3", label: "Аудит доступа", start: at(-8), end: at(1), tone: "danger" }],
  },
  {
    id: "info",
    name: "На согласовании",
    bars: [{ id: "s-4", label: "Смета", start: at(3), end: at(10), tone: "info" }],
  },
];

export default function GanttVariantsExample() {
  return (
    <div>
      <div>
        <div>
          <Gantt
            aria-label="Проекты по направлениям"
            rows={BY_PROJECT}
            getRowKey={(row) => row.id}
            getRowLabel={(row) => row.name}
            getRowBars={(row) => row.bars}
          />
          <Typography as="span" variant="caption" tone="muted">
            color
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <Gantt
            aria-label="Задачи по статусу"
            rows={BY_STATUS}
            getRowKey={(row) => row.id}
            getRowLabel={(row) => row.name}
            getRowBars={(row) => row.bars}
          />
          <Typography as="span" variant="caption" tone="muted">
            tone
          </Typography>
        </div>
      </div>
    </div>
  );
}
