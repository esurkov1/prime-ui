/** A ticket queue as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one; the chosen ticket cross-fades in — `PageContent.Split`, `PageContent.Panel`, `PageContent.BackButton`, `fill`. */
import { Card, Crossfade, List, PageContent, ScrollContainer, Typography } from "prime-ui-kit";
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

export default function PageContentListDetailExample() {
  const [ticketId, setTicketId] = React.useState<string | null>(null);
  // The last opened ticket stays in the detail while the narrow split goes back to the list.
  const [shown, setShown] = React.useState<Ticket | null>(null);

  const open = (ticket: Ticket) => {
    setTicketId(ticket.id);
    setShown(ticket);
  };

  return (
    <div className={styles.fillMain}>
      <PageContent.Root fill>
        <PageContent.Body>
          <PageContent.Split
            open={ticketId !== null}
            onOpenChange={(next) => {
              if (!next) setTicketId(null);
            }}
          >
            <PageContent.Panel kind="list" aria-label="Обращения">
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
            </PageContent.Panel>

            <PageContent.Panel kind="detail" aria-label="Обращение">
              <Card.Root className={styles.paneCard}>
                <div className={styles.threadHeader}>
                  <PageContent.BackButton />
                  <Typography as="h2" variant="title-s">
                    {shown ? `${shown.id} · ${shown.subject}` : "Выберите обращение"}
                  </Typography>
                </div>
                <ScrollContainer anchor="end" className={styles.pane}>
                  <Crossfade state={shown?.id ?? "none"}>
                    {shown ? (
                      <ul className={styles.notes}>
                        {shown.notes.map((text) => (
                          <li key={text}>
                            <Typography variant="body-m">{text}</Typography>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body-m" tone="muted" className={styles.hint}>
                        История обращения откроется здесь.
                      </Typography>
                    )}
                  </Crossfade>
                </ScrollContainer>
              </Card.Root>
            </PageContent.Panel>
          </PageContent.Split>
        </PageContent.Body>
      </PageContent.Root>
    </div>
  );
}
