/** A ticket queue as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one; the chosen ticket cross-fades in — `Page.Split`, `Page.List`, `Page.Detail`, `Page.BackButton`, `fill`. */
import { Card, Crossfade, List, Page, ScrollContainer, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Ticket = { id: string; subject: string; client: string; open: number; notes: string[] };

const TICKETS: Ticket[] = [
  {
    id: "T-4821",
    subject: "Счёт без НДС",
    client: "ООО «Гранит»",
    open: 2,
    notes: [
      "Счёт № 4821 пришёл без НДС.",
      "Проверили реквизиты: ставка не подставилась из договора.",
      "Нужно провести до пятницы.",
      "Исправили ставку, новый счёт № 4830 отправлен на почту.",
    ],
  },
  {
    id: "T-4817",
    subject: "Перенос доставки",
    client: "ООО «Лето»",
    open: 0,
    notes: ["Просят перенести доставку на среду.", "Перенесли на 15 октября, склад предупреждён."],
  },
  {
    id: "T-4809",
    subject: "Подключение ЭДО",
    client: "ИП Козлов",
    open: 1,
    notes: ["Нужно подключить ЭДО.", "Запросили идентификатор в Диадоке."],
  },
];

export default function PageListDetailExample() {
  const [ticketId, setTicketId] = React.useState<string | null>(null);
  // The last opened ticket stays in the detail while the narrow split goes back to the list.
  const [shown, setShown] = React.useState<Ticket | null>(null);

  const open = (ticket: Ticket) => {
    setTicketId(ticket.id);
    setShown(ticket);
  };

  return (
    <div className={styles.fillMain}>
      <Page.Root fill>
        <Page.Body>
          <Page.Split
            open={ticketId !== null}
            onOpenChange={(next) => {
              if (!next) setTicketId(null);
            }}
          >
            <Page.List aria-label="Обращения">
              <Card.Root className={styles.paneCard}>
                <ScrollContainer className={styles.pane}>
                  <List.Root className={styles.tickets}>
                    {TICKETS.map((ticket) => (
                      <List.Item
                        key={ticket.id}
                        current={ticket.id === ticketId}
                        onClick={() => open(ticket)}
                      >
                        <List.ItemText>{ticket.subject}</List.ItemText>
                        <List.ItemDescription>{ticket.client}</List.ItemDescription>
                        {ticket.open > 0 ? (
                          <List.ItemCount color="blue">{ticket.open}</List.ItemCount>
                        ) : null}
                      </List.Item>
                    ))}
                  </List.Root>
                </ScrollContainer>
              </Card.Root>
            </Page.List>

            <Page.Detail aria-label="Обращение">
              <Card.Root className={styles.paneCard}>
                <div className={styles.threadHeader}>
                  <Page.BackButton />
                  <Typography as="h2" variant="title-s">
                    {shown ? `${shown.id} · ${shown.subject}` : "Выберите обращение"}
                  </Typography>
                </div>
                <ScrollContainer anchor="end" className={styles.pane}>
                  <Crossfade state={shown?.id ?? "none"}>
                    {shown ? (
                      <div className={styles.notes}>
                        {shown.notes.map((text) => (
                          <Typography key={text} variant="body-m">
                            {text}
                          </Typography>
                        ))}
                      </div>
                    ) : (
                      <Typography variant="body-m" tone="muted" className={styles.hint}>
                        История обращения откроется здесь.
                      </Typography>
                    )}
                  </Crossfade>
                </ScrollContainer>
              </Card.Root>
            </Page.Detail>
          </Page.Split>
        </Page.Body>
      </Page.Root>
    </div>
  );
}
