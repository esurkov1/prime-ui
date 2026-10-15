/** A page whose figures load after it opens: the line of data keeps its place under the title while it loads, so nothing in the bar moves — `loading`. */
import { Button, Card, Crossfade, Icon, Page, Skeleton, Typography } from "prime-ui-kit";
import * as React from "react";

const ORDERS = [
  { id: "№ 4821", client: "ООО «Север»", sum: "84 000 ₽" },
  { id: "№ 4820", client: "ИП Котов", sum: "12 500 ₽" },
  { id: "№ 4819", client: "ООО «Вектор»", sum: "230 000 ₽" },
];

const LOAD_MS = 1200;

export default function PageLoadingExample() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!loading) return;
    const timer = window.setTimeout(() => setLoading(false), LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [loading]);

  return (
    <Page.Root>
      <Page.TopBar sticky={false}>
        <Page.Heading>
          <Page.Title>Заказы</Page.Title>
          <Page.Description loading={loading}>128 в работе · 6 ждут оплаты</Page.Description>
        </Page.Heading>
        <Page.Actions>
          <Button.Root variant="soft" tone="neutral" onClick={() => setLoading(true)}>
            <Button.Icon>
              <Icon name="action.refresh" />
            </Button.Icon>
            Обновить
          </Button.Root>
        </Page.Actions>
      </Page.TopBar>
      <Page.Body>
        <Card.Root variant="list" aria-busy={loading || undefined}>
          <Card.Body>
            <Crossfade state={loading ? "loading" : "data"}>
              {loading ? (
                <Skeleton lines={ORDERS.length} />
              ) : (
                ORDERS.map((order) => (
                  <Typography key={order.id} variant="body-m">
                    {order.id} · {order.client} · {order.sum}
                  </Typography>
                ))
              )}
            </Crossfade>
          </Card.Body>
        </Card.Root>
      </Page.Body>
    </Page.Root>
  );
}
