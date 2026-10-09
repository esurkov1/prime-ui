/** A support inbox as list + detail on a full-height page: side by side on a wide panel, one pane at a time with a back button on a narrow one — `PageContent.Split`, `PageContent.BackButton`, `fill`. */
import { Badge, Button, Card, PageContent, ScrollContainer, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Dialog = { id: string; client: string; unread: number; messages: string[] };

const DIALOGS: Dialog[] = [
  {
    id: "granit",
    client: "ООО «Гранит»",
    unread: 2,
    messages: [
      "Счёт № 4821 пришёл без НДС.",
      "Проверю реквизиты и вернусь.",
      "Нужно провести до пятницы.",
      "Исправили ставку, новый счёт № 4830 на почте.",
    ],
  },
  {
    id: "leto",
    client: "ООО «Лето»",
    unread: 0,
    messages: ["Можно перенести доставку на среду?", "Да, перенесли на 15 октября."],
  },
  {
    id: "kozlov",
    client: "ИП Козлов",
    unread: 1,
    messages: ["Подключите, пожалуйста, ЭДО.", "Пришлите идентификатор в Диадоке."],
  },
];

export default function PageContentListDetailExample() {
  const [dialogId, setDialogId] = React.useState<string | null>(null);
  // The last opened dialog stays in the detail while the narrow split goes back to the list.
  const [shown, setShown] = React.useState<Dialog | null>(null);

  const open = (dialog: Dialog) => {
    setDialogId(dialog.id);
    setShown(dialog);
  };

  return (
    <div className={styles.fillMain}>
      <PageContent.Root fill>
        <PageContent.Header>
          <PageContent.Title>Обращения</PageContent.Title>
        </PageContent.Header>
        <PageContent.Body>
          <PageContent.Split
            open={dialogId !== null}
            onOpenChange={(next) => {
              if (!next) setDialogId(null);
            }}
          >
            <PageContent.List aria-label="Диалоги">
              <Card.Root className={styles.paneCard}>
                <ScrollContainer className={styles.pane}>
                  <ul className={styles.dialogs}>
                    {DIALOGS.map((dialog) => (
                      <li key={dialog.id}>
                        <Button.Root
                          variant={dialog.id === dialogId ? "soft" : "ghost"}
                          tone="neutral"
                          fullWidth
                          aria-current={dialog.id === dialogId ? "true" : undefined}
                          className={styles.dialog}
                          onClick={() => open(dialog)}
                        >
                          {dialog.client}
                          {dialog.unread > 0 ? (
                            <Badge.Root color="blue">{dialog.unread}</Badge.Root>
                          ) : null}
                        </Button.Root>
                      </li>
                    ))}
                  </ul>
                </ScrollContainer>
              </Card.Root>
            </PageContent.List>

            <PageContent.Detail aria-label="Переписка">
              <Card.Root className={styles.paneCard}>
                <div className={styles.threadHeader}>
                  <PageContent.BackButton />
                  <Typography as="h2" variant="title-s">
                    {shown?.client ?? "Выберите диалог"}
                  </Typography>
                </div>
                <ScrollContainer anchor="end" className={styles.pane}>
                  {shown ? (
                    <ul className={styles.messages}>
                      {shown.messages.map((text) => (
                        <li key={text}>
                          <Typography variant="body-m">{text}</Typography>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography variant="body-m" tone="muted" className={styles.hint}>
                      Переписка откроется здесь.
                    </Typography>
                  )}
                </ScrollContainer>
              </Card.Root>
            </PageContent.Detail>
          </PageContent.Split>
        </PageContent.Body>
      </PageContent.Root>
    </div>
  );
}
