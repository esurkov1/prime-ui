/** Every move is saved on the server: the card waits busy in its new place, and an invoice the server refuses to close glides back to its column — `onValueChange`. */
import { Kanban, type KanbanValue, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Invoice = { id: string; client: string; amount: string; paid: boolean };

const COLUMNS = [
  { id: "draft", title: "Черновики" },
  { id: "sent", title: "Отправлены" },
  { id: "paid", title: "Оплачены" },
];

const INVOICES: Invoice[] = [
  { id: "INV-2041", client: "ООО «Север»", amount: "48 300 ₽", paid: true },
  { id: "INV-2042", client: "АО «Гранит»", amount: "212 000 ₽", paid: false },
  { id: "INV-2038", client: "ИП Лебедев", amount: "7 950 ₽", paid: true },
  { id: "INV-2035", client: "ООО «Вектор»", amount: "95 400 ₽", paid: true },
];

const INITIAL: KanbanValue = {
  draft: ["INV-2041", "INV-2042"],
  sent: ["INV-2038"],
  paid: ["INV-2035"],
};

const BY_ID = new Map(INVOICES.map((invoice) => [invoice.id, invoice]));

/** The server's answer to a move, a beat later: no payment, no «Оплачены». */
function saveMove(id: string, to: string) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (to === "paid" && !BY_ID.get(id)?.paid) {
        reject(new Error(`${id}: оплата не поступила`));
      } else {
        resolve();
      }
    }, 900);
  });
}

export default function KanbanSavingExample() {
  const [placement, setPlacement] = React.useState(INITIAL);
  const [failure, setFailure] = React.useState<string | null>(null);

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <Typography as="span" variant="body-s" tone={failure ? "danger" : "muted"}>
          {failure ?? "Перенос сохраняется на сервере; без оплаты счёт не закрыть"}
        </Typography>
      </div>
      <Kanban.Root
        aria-label="Счета за октябрь"
        className={styles.board}
        columns={COLUMNS}
        items={INVOICES}
        getId={(invoice) => invoice.id}
        getLabel={(invoice) => invoice.id}
        value={placement}
        onValueChange={async (next, move) => {
          setFailure(null);
          try {
            await saveMove(move.id, move.to);
          } catch (error) {
            setFailure(error instanceof Error ? error.message : String(error));
            throw error;
          }
          setPlacement(next);
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
