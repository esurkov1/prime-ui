/** Two thousand people over two years stay fast: only the rows and days in view are rendered, keyboard focus reaches any row, and new bars are drawn on empty space — `rows`, `range`, `scrollHeight`, `onBarCreate`. */
import { addDays, startOfToday, startOfYear } from "date-fns";
import { Gantt, type GanttBar, type GanttDates } from "prime-ui-kit";
import * as React from "react";

type Person = { id: string; name: string; bars: GanttBar[] };

const FIRST_NAMES = ["Анна", "Илья", "Ольга", "Пётр", "Мария", "Денис", "Елена", "Антон"];
const LAST_NAMES = [
  "Котова",
  "Гордеев",
  "Белова",
  "Соколов",
  "Лебедева",
  "Орлов",
  "Зуева",
  "Морозов",
];
const PROJECTS = [
  "Внедрение CRM",
  "Аудит склада",
  "Миграция данных",
  "Запуск портала",
  "Отчётность",
];
const COLORS = ["blue", "teal", "orange", "purple", "green"] as const;

const YEAR = startOfYear(startOfToday());
const RANGE: GanttDates = { start: YEAR, end: addDays(YEAR, 2 * 365) };

/** A fixed pseudo-random sequence: the same plan on every render and in every browser. */
function sequence(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1_103_515_245 + 12_345) % 2_147_483_648;
    return state / 2_147_483_648;
  };
}

function buildTeam(): Person[] {
  const next = sequence(42);
  return Array.from({ length: 2000 }, (_, index) => {
    const bars: GanttBar[] = [];
    let day = Math.floor(next() * 40);
    while (day < 2 * 365 - 10) {
      const length = 5 + Math.floor(next() * 40);
      const project = Math.floor(next() * PROJECTS.length);
      bars.push({
        id: `${index}-${day}`,
        label: PROJECTS[project],
        start: addDays(YEAR, day),
        end: addDays(YEAR, day + length),
        color: COLORS[project],
      });
      day += length + 10 + Math.floor(next() * 60);
    }
    const first = FIRST_NAMES[index % FIRST_NAMES.length];
    const last = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
    return { id: `p-${index}`, name: `${first} ${last} · ${index + 1}`, bars };
  });
}

const TEAM = buildTeam();

export default function GanttLargeExample() {
  const [team, setTeam] = React.useState(TEAM);

  const addBar = (dates: GanttDates, person: Person) =>
    setTeam((people) =>
      people.map((item) =>
        item.id === person.id
          ? {
              ...item,
              bars: [
                ...item.bars,
                { id: `${item.id}-new-${item.bars.length}`, label: "Новая задача", ...dates },
              ],
            }
          : item,
      ),
    );

  return (
    <Gantt
      aria-label="Загрузка компании"
      defaultZoom="day"
      range={RANGE}
      scrollHeight={480}
      rows={team}
      getRowKey={(person) => person.id}
      getRowLabel={(person) => person.name}
      getRowBars={(person) => person.bars}
      onBarCreate={addBar}
    />
  );
}
