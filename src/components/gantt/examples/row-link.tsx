/** A team by client: each row header is a link to the person's profile that a plain click opens in place, each tooltip adds the client and the planned hours under the dates, and a legend of client hues stands in the toolbar — `getRowHref`, `onRowClick`, `renderBarTooltip`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Badge, Gantt, type GanttBar, type PaletteColor, Typography } from "prime-ui-kit";
import * as React from "react";

type ClientId = "granit" | "tekhnostil" | "kvartal";

type Work = GanttBar & { client: ClientId; hours: number };

type Person = { id: string; name: string; bars: Work[] };

const CLIENTS: Record<ClientId, { name: string; color: PaletteColor }> = {
  granit: { name: "ООО «Гранит»", color: "teal" },
  tekhnostil: { name: "АО «Техностиль»", color: "blue" },
  kvartal: { name: "ООО «Зелёный квартал»", color: "pink" },
};

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });

const work = (
  id: string,
  label: string,
  client: ClientId,
  from: number,
  to: number,
  hours: number,
): Work => ({
  id,
  label,
  client,
  hours,
  color: CLIENTS[client].color,
  start: addDays(WEEK, from),
  end: addDays(WEEK, to),
});

const TEAM: Person[] = [
  {
    id: "kotova",
    name: "Анна Котова",
    bars: [
      work("k-1", "Обследование процессов", "granit", -2, 4, 32),
      work("k-2", "ТЗ на интеграцию", "tekhnostil", 5, 12, 40),
    ],
  },
  {
    id: "gordeev",
    name: "Илья Гордеев",
    bars: [
      work("g-1", "Интеграция с 1С", "tekhnostil", 0, 9, 56),
      work("g-2", "Обмен с банком", "kvartal", 10, 16, 36),
    ],
  },
  {
    id: "belova",
    name: "Ольга Белова",
    bars: [
      work("b-1", "Настройка ролей", "granit", 1, 6, 24),
      work("b-2", "Обучение пользователей", "kvartal", 8, 13, 20),
    ],
  },
];

export default function GanttRowLinkExample() {
  const [opened, setOpened] = React.useState<string | null>(null);

  return (
    <Gantt<Person, Work>
      aria-label="Работы команды по клиентам"
      rows={TEAM}
      getRowKey={(person) => person.id}
      getRowLabel={(person) => person.name}
      getRowBars={(person) => person.bars}
      getRowHref={(person) => `/team/${person.id}`}
      onRowClick={(person, event) => {
        // A client-side router goes here (navigate(href)); the page itself never reloads.
        event.preventDefault();
        setOpened(person.name);
      }}
      renderBarTooltip={(bar) => `${CLIENTS[bar.client].name} · ${bar.hours} ч по плану`}
      toolbar={
        <>
          {(Object.keys(CLIENTS) as ClientId[]).map((client) => (
            <Badge.Root key={client} color={CLIENTS[client].color}>
              <Badge.Dot />
              {CLIENTS[client].name}
            </Badge.Root>
          ))}
          <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
            {opened ? `Открыт профиль: ${opened}` : null}
          </Typography>
        </>
      }
    />
  );
}
