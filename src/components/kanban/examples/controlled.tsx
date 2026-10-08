/** The placement lives in the parent: every move arrives with its source, target and position to save, and a button resets the board — `value`, `onValueChange`. */
import { Button, Kanban, type KanbanMove, type KanbanValue, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Invoice = { id: string; client: string; amount: string };

const COLUMNS = [
  { id: "draft", title: "Черновики" },
  { id: "sent", title: "Отправлены" },
  { id: "paid", title: "Оплачены" },
];

const INVOICES: Invoice[] = [
  { id: "INV-2041", client: "ООО «Север»", amount: "48 300 ₽" },
  { id: "INV-2042", client: "АО «Гранит»", amount: "212 000 ₽" },
  { id: "INV-2038", client: "ИП Лебедев", amount: "7 950 ₽" },
  { id: "INV-2035", client: "ООО «Вектор»", amount: "95 400 ₽" },
];

const INITIAL: KanbanValue = {
  draft: ["INV-2041", "INV-2042"],
  sent: ["INV-2038"],
  paid: ["INV-2035"],
};

const TITLES = new Map(COLUMNS.map((column) => [column.id, column.title]));

export default function KanbanControlledExample() {
  const [placement, setPlacement] = React.useState(INITIAL);
  const [lastMove, setLastMove] = React.useState<KanbanMove | null>(null);

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
          {lastMove
            ? `${lastMove.id}: ${TITLES.get(lastMove.from)} → ${TITLES.get(lastMove.to)}, позиция ${lastMove.index + 1}`
            : "Перенесите счёт — изменение уйдёт на сервер"}
        </Typography>
        <div className={styles.spacer} />
        <Button.Root
          variant="ghost"
          tone="neutral"
          disabled={placement === INITIAL}
          onClick={() => {
            setPlacement(INITIAL);
            setLastMove(null);
          }}
        >
          Сбросить
        </Button.Root>
      </div>
      <Kanban.Root
        aria-label="Счета за октябрь"
        className={styles.board}
        columns={COLUMNS}
        items={INVOICES}
        getId={(invoice) => invoice.id}
        getLabel={(invoice) => invoice.id}
        value={placement}
        onValueChange={(next, move) => {
          setPlacement(next);
          setLastMove(move);
        }}
        renderItem={(invoice) => (
          <Kanban.Item>
            <Kanban.ItemTitle>{invoice.client}</Kanban.ItemTitle>
            <Kanban.ItemDescription>
              {invoice.id} · {invoice.amount}
            </Kanban.ItemDescription>
          </Kanban.Item>
        )}
      />
    </div>
  );
}
