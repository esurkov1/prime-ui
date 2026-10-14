/** A project estimate as a table: each stage is its own body of rows under a heading row that never moves, a row is carried by its grip within a stage or into another, and the rows stay table rows — `as`, `header`, `kind`, `handle`. */
import { Dnd, moveBefore, Typography, VisuallyHidden } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Line = { id: string; title: string; hours: number };
type Stage = { id: string; title: string; lines: Line[] };

const ESTIMATE: Stage[] = [
  {
    id: "analysis",
    title: "Обследование",
    lines: [
      { id: "interviews", title: "Интервью с отделом продаж", hours: 12 },
      { id: "processes", title: "Описание процессов", hours: 20 },
    ],
  },
  {
    id: "setup",
    title: "Настройка",
    lines: [
      { id: "roles", title: "Роли и права доступа", hours: 8 },
      { id: "import", title: "Перенос клиентской базы", hours: 16 },
      { id: "training", title: "Обучение менеджеров", hours: 6 },
    ],
  },
];

/** Moves line `id` in front of `beforeId` (`null` — last) in stage `to`, from whichever stage holds it. */
const moveLine = (stages: Stage[], id: string, beforeId: string | null, to: string) => {
  const line = stages.flatMap((stage) => stage.lines).find((item) => item.id === id);
  if (!line) return stages;
  return stages.map((stage) => {
    const rest = stage.lines.filter((item) => item.id !== id);
    if (stage.id !== to) return { ...stage, lines: rest };
    return { ...stage, lines: moveBefore([...rest, line], id, beforeId, (item) => item.id) };
  });
};

export default function DndTableExample() {
  const [stages, setStages] = React.useState(ESTIMATE);

  return (
    <Dnd.Root>
      <table className={styles.table}>
        <caption className={styles.caption}>
          <Typography as="span" variant="title-s">
            Смета внедрения CRM
          </Typography>
        </caption>
        <thead>
          <tr>
            <th scope="col" className={styles.grip}>
              <VisuallyHidden>Порядок</VisuallyHidden>
            </th>
            <th scope="col" className={styles.cell}>
              <Typography as="span" variant="caption" tone="muted">
                Работа
              </Typography>
            </th>
            <th scope="col" className={styles.numeric}>
              <Typography as="span" variant="caption" tone="muted">
                Часы
              </Typography>
            </th>
          </tr>
        </thead>
        {stages.map((stage) => (
          <Dnd.Sortable
            key={stage.id}
            as="tbody"
            kind="estimate-line"
            handle
            aria-label={stage.title}
            items={stage.lines}
            getId={(line) => line.id}
            getLabel={(line) => line.title}
            onReorder={(id, beforeId) =>
              setStages((current) => moveLine(current, id, beforeId, stage.id))
            }
            header={
              <tr>
                <th scope="colgroup" colSpan={3} className={styles.groupCell}>
                  <Typography as="span" variant="body-m">
                    {stage.title}
                  </Typography>
                </th>
              </tr>
            }
            renderItem={(line) => (
              <Dnd.SortableItem id={line.id}>
                <td className={styles.grip}>
                  <Dnd.Handle />
                </td>
                <td className={styles.cell}>
                  <Typography as="span" variant="body-m">
                    {line.title}
                  </Typography>
                </td>
                <td className={styles.numeric}>
                  <Typography as="span" variant="body-m">
                    {line.hours}
                  </Typography>
                </td>
              </Dnd.SortableItem>
            )}
          />
        ))}
      </table>
    </Dnd.Root>
  );
}
