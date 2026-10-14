/** A live exchange log pinned to its last entry: a new entry keeps it at the end, scrolling up loads older ones without moving what is on screen — `anchor`, `onReachStart`. */
import { Button, Card, ScrollContainer, Skeleton, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Entry = { id: number; time: string; text: string };

const HISTORY: Entry[] = [
  "Выгрузка заказов в 1С начата",
  "Заказ № 1042 выгружен",
  "Заказ № 1043 выгружен",
  "Заказ № 1044: нет склада отгрузки, пропущен",
  "Остатки склада «Москва» обновлены",
  "Цены прайса «Опт» обновлены",
  "Счёт № 4830 выгружен",
  "Счёт № 4831 выгружен",
  "Платёж по счёту № 4821 получен",
  "Контрагент ООО «Гранит» сопоставлен",
  "Акт № 312 выгружен",
  "Выгрузка завершена: 9 из 10",
].map((text, index) => ({
  id: index + 1,
  time: `09:${String(index * 4).padStart(2, "0")}`,
  text,
}));

const ARRIVING = [
  "Новый заказ № 1045 принят",
  "Остатки склада «Казань» обновлены",
  "Счёт № 4832 выгружен",
];

const PAGE = 4;

export default function ScrollContainerLogExample() {
  // The newest entries first; older pages arrive when the reader scrolls up.
  const [shown, setShown] = React.useState(PAGE);
  const [loading, setLoading] = React.useState(false);
  const [arrived, setArrived] = React.useState<Entry[]>([]);
  const entries = [...HISTORY.slice(-shown), ...arrived];

  const loadOlder = () => {
    if (shown >= HISTORY.length) return;
    setLoading(true);
    // The promise keeps the region `aria-busy` and stops repeat calls until it settles.
    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setShown((count) => Math.min(count + PAGE, HISTORY.length));
        setLoading(false);
        resolve();
      }, 800);
    });
  };

  const receive = () => {
    setArrived((list) => [
      ...list,
      {
        id: HISTORY.length + list.length + 1,
        time: `10:${String(list.length * 3).padStart(2, "0")}`,
        text: ARRIVING[list.length % ARRIVING.length],
      },
    ]);
  };

  return (
    <Card.Root className={styles.log}>
      <Card.Header>
        <Card.Title>Обмен с 1С</Card.Title>
        <Button.Root variant="soft" tone="neutral" onClick={receive}>
          Новое событие
        </Button.Root>
      </Card.Header>
      <ScrollContainer
        anchor="end"
        onReachStart={loadOlder}
        tabIndex={0}
        role="log"
        aria-label="Журнал обмена"
        className={styles.entries}
      >
        {loading ? <Skeleton lines={2} className={styles.older} /> : null}
        <ul className={styles.list}>
          {entries.map((entry) => (
            <li key={entry.id}>
              <Typography as="span" variant="caption" tone="muted">
                {entry.time}
              </Typography>
              <Typography variant="body-m">{entry.text}</Typography>
            </li>
          ))}
        </ul>
      </ScrollContainer>
    </Card.Root>
  );
}
