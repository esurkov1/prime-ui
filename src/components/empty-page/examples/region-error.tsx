/** A data region that failed to load: the error state takes the region, the retry shows its loading until the data cross-fades in; its text comes from labels — `tone`, `layout`, `EmptyPage.RetryButton`, `onRetry`, `labels`. */
import {
  Button,
  Card,
  Crossfade,
  DescriptionList,
  EmptyPage,
  Icon,
  Skeleton,
  Tooltip,
} from "prime-ui-kit";
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
        <Card.Actions>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Button.Root
                variant="ghost"
                tone="neutral"
                size="s"
                aria-label="Обновить счета"
                disabled={state === "loading"}
                onClick={() => setState("loading")}
              >
                <Button.Icon>
                  <Icon name="action.refresh" />
                </Button.Icon>
              </Button.Root>
            </Tooltip.Trigger>
            <Tooltip.Content>Обновить счета</Tooltip.Content>
          </Tooltip.Root>
        </Card.Actions>
      </Card.Header>
      <Card.Body>
        <Crossfade state={state} aria-busy={state === "loading"}>
          {state === "loading" ? (
            <Skeleton lines={3} />
          ) : state === "error" ? (
            <EmptyPage.Root
              layout="fill"
              size="s"
              tone="danger"
              labels={{ retry: "Загрузить снова" }}
              aria-labelledby="invoices-error"
            >
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
            <DescriptionList.Root align="end">
              {INVOICES.map((invoice) => (
                <DescriptionList.Item key={invoice.id} label={invoice.client}>
                  {invoice.amount}
                </DescriptionList.Item>
              ))}
            </DescriptionList.Root>
          )}
        </Crossfade>
      </Card.Body>
    </Card.Root>
  );
}
