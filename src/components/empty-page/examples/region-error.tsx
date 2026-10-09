/** A data region that failed to load: the error state takes the region, the retry shows its loading until the data cross-fades in — `tone`, `layout`, `EmptyPage.RetryButton`, `onRetry`. */
import { Button, Card, Crossfade, EmptyPage, Icon, Skeleton, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type RegionState = "loading" | "error" | "ready";

const INVOICES = [
  { id: "inv-4821", client: "ООО «Гранит»", amount: "94 750 ₽" },
  { id: "inv-4822", client: "АО «Альфа Медиа»", amount: "380 000 ₽" },
  { id: "inv-4823", client: "ИП Орлов Д. С.", amount: "18 000 ₽" },
];

const RESPONSE_MS = 1200;

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export default function EmptyPageRegionErrorExample() {
  const [state, setState] = React.useState<RegionState>("loading");

  // The first request fails, as a server that is down would.
  React.useEffect(() => {
    if (state !== "loading") return;
    const id = window.setTimeout(() => setState("error"), RESPONSE_MS);
    return () => window.clearTimeout(id);
  }, [state]);

  const retry = async () => {
    await wait(RESPONSE_MS);
    setState("ready");
  };

  return (
    <Card.Root role="region" aria-labelledby="invoices-title" className={styles.region}>
      <Card.Header>
        <Card.Title id="invoices-title">Счета к оплате</Card.Title>
        <Button.Root
          variant="ghost"
          tone="neutral"
          size="s"
          disabled={state === "loading"}
          onClick={() => setState("loading")}
        >
          <Button.Icon>
            <Icon name="action.refresh" />
          </Button.Icon>
          Обновить
        </Button.Root>
      </Card.Header>
      <Card.Body>
        <Crossfade state={state} aria-busy={state === "loading"}>
          {state === "loading" ? (
            <Skeleton lines={3} />
          ) : state === "error" ? (
            <EmptyPage.Root layout="fill" size="s" tone="danger" aria-labelledby="invoices-error">
              <EmptyPage.Icon>
                <Icon name="status.offline" />
              </EmptyPage.Icon>
              <EmptyPage.Title as="h4" id="invoices-error">
                Не удалось загрузить счета
              </EmptyPage.Title>
              <EmptyPage.Description>Сервер не ответил. Данные не потеряны.</EmptyPage.Description>
              <EmptyPage.Actions>
                <EmptyPage.RetryButton onRetry={retry} />
              </EmptyPage.Actions>
            </EmptyPage.Root>
          ) : (
            <ul className={styles.list}>
              {INVOICES.map((invoice) => (
                <li key={invoice.id} className={styles.row}>
                  <Typography as="span" variant="body-m">
                    {invoice.client}
                  </Typography>
                  <Typography as="span" variant="body-m" tone="secondary">
                    {invoice.amount}
                  </Typography>
                </li>
              ))}
            </ul>
          )}
        </Crossfade>
      </Card.Body>
    </Card.Root>
  );
}
