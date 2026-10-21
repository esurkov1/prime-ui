/** Team occupancy by day: people with avatars, projects that overlap into lanes, locked vacations, a saved move held busy and a conflicting one gliding back, new work drawn on a free day — `renderRowAvatar`, `renderRow`, `onBarChange`, `onBarCreate`, `onItemOpen`, `edit`. */
import { addDays, startOfToday, startOfWeek } from "date-fns";
import { Avatar, Gantt, type GanttBar, type GanttDates, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Person = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: "blue" | "green" | "orange" | "purple";
  bars: GanttBar[];
};

const WEEK = startOfWeek(startOfToday(), { weekStartsOn: 1 });
const at = (days: number) => addDays(WEEK, days);

const TEAM: Person[] = [
  {
    id: "kotova",
    name: "Анна Котова",
    role: "Аналитик",
    initials: "АК",
    color: "blue",
    bars: [
      { id: "k-1", label: "Аудит склада", start: at(-2), end: at(4), color: "teal" },
      { id: "k-2", label: "Отчёт для «Альфа-Трейд»", start: at(2), end: at(9), color: "orange" },
      {
        id: "k-3",
        label: "Отпуск",
        start: at(14),
        end: at(24),
        color: "purple",
        edit: "none",
      },
    ],
  },
  {
    id: "gordeev",
    name: "Илья Гордеев",
    role: "Разработчик",
    initials: "ИГ",
    color: "green",
    bars: [
      { id: "g-1", label: "Интеграция с банком", start: at(0), end: at(12), color: "blue" },
      { id: "g-2", label: "Дежурство", start: at(12), end: at(14), tone: "neutral" },
    ],
  },
  {
    id: "belova",
    name: "Ольга Белова",
    role: "Дизайнер",
    initials: "ОБ",
    color: "orange",
    bars: [
      {
        id: "b-1",
        label: "Больничный",
        start: at(-1),
        end: at(3),
        tone: "warning",
        edit: "none",
      },
      { id: "b-2", label: "Макеты кабинета", start: at(3), end: at(15), color: "pink" },
    ],
  },
  {
    id: "sokolov",
    name: "Пётр Соколов",
    role: "Менеджер проекта",
    initials: "ПС",
    color: "purple",
    bars: [{ id: "s-1", label: "Запуск у клиента", start: at(7), end: at(18), color: "green" }],
  },
];

/** The request to the schedule service: refuses anything that lands on a vacation. */
function saveDates(person: Person, dates: GanttDates, bar: GanttBar) {
  return new Promise<void>((resolve, reject) => {
    const clash = person.bars.some(
      (other) =>
        other.id !== bar.id &&
        other.edit === "none" &&
        dates.start < other.end &&
        other.start < dates.end,
    );
    window.setTimeout(
      () => (clash ? reject(new Error("Пересекается с отпуском")) : resolve()),
      900,
    );
  });
}

export default function GanttOccupancyExample() {
  const [team, setTeam] = React.useState(TEAM);
  const [selected, setSelected] = React.useState<string | null>(null);

  const moveBar = async (dates: GanttDates, bar: GanttBar, person: Person) => {
    await saveDates(person, dates, bar);
    setTeam((people) =>
      people.map((item) => ({
        ...item,
        bars: item.bars.map((other) => (other.id === bar.id ? { ...other, ...dates } : other)),
      })),
    );
  };

  // A new bar is saved first; it lands where its ghost stood. A vacation refuses it.
  const addBar = async (dates: GanttDates, person: Person) => {
    const bar: GanttBar = { id: `${person.id}-${Date.now()}`, label: "Новая задача", ...dates };
    await saveDates(person, dates, bar);
    setTeam((people) =>
      people.map((item) => (item.id === person.id ? { ...item, bars: [...item.bars, bar] } : item)),
    );
  };

  return (
    <Gantt
      aria-label="Загрузка команды"
      defaultZoom="day"
      rows={team}
      getRowKey={(person) => person.id}
      getRowLabel={(person) => person.name}
      getRowBars={(person) => person.bars}
      renderRowAvatar={(person) => (
        <Avatar.Root color={person.color}>
          <Avatar.Fallback>{person.initials}</Avatar.Fallback>
        </Avatar.Root>
      )}
      renderRow={(person) => (
        <span className={styles.person}>
          <Typography as="span" variant="body-m">
            {person.name}
          </Typography>
          <Typography as="span" variant="caption" tone="muted">
            {person.role}
          </Typography>
        </span>
      )}
      onBarChange={moveBar}
      onBarCreate={addBar}
      onItemOpen={(bar, person) => setSelected(`${bar.label} · ${person.name}`)}
      toolbar={
        <Typography as="span" variant="body-s" tone="muted">
          {selected ?? "Выберите задачу, чтобы открыть карточку"}
        </Typography>
      }
    />
  );
}
