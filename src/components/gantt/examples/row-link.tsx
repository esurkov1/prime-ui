/** A team by client: each row header is a link to the person's profile that a plain click opens in place, each tooltip adds the client and the planned hours under the dates, and the clients are categories: their hues colour the bars and stand in the legend — `getRowHref`, `onRowClick`, `renderBarTooltip`, `categories`, `legend`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Gantt, type GanttBar, type GanttCategory, Typography } from "prime-ui-kit";
import * as React from "react";

type ClientId = "granit" | "tekhnostil" | "kvartal";

type Work = GanttBar & { client: ClientId; hours: number };

type Person = { id: string; name: string; bars: Work[] };

/** The clients as categories of bars: a hue each and an entry in the legend. */
const CLIENTS: (GanttCategory & { id: ClientId })[] = [
  { id: "granit", label: "ООО «Гранит»", color: "teal" },
  { id: "tekhnostil", label: "АО «Техностиль»", color: "blue" },
  { id: "kvartal", label: "ООО «Зелёный квартал»", color: "pink" },
];

const CLIENT_NAME = new Map(CLIENTS.map((client) => [client.id, client.label]));

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
  category: client,
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
      renderBarTooltip={(bar) => `${CLIENT_NAME.get(bar.client)} · ${bar.hours} ч по плану`}
      categories={CLIENTS}
      legend
      toolbar={
        <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
          {opened ? `Открыт профиль: ${opened}` : "Нажмите на имя, чтобы открыть профиль"}
        </Typography>
      }
    />
  );
}
