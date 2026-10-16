/** A record opened by a link knows only its id: the title and the line under it hold their place in skeletons, the body keeps the data's geometry, then the name and the data fade in — `Drawer.Title`, `loading`. */
import { Button, Crossfade, DescriptionList, Drawer, Skeleton } from "prime-ui-kit";
import * as React from "react";

const INVOICE = {
  title: "Счёт №5521",
  summary: "ООО «Северный ветер» · до 30 октября",
  facts: [
    ["Сумма", "248 000 ₽"],
    ["Статус", "Ждёт оплаты"],
    ["Выставлен", "16 октября"],
  ],
};

export default function DrawerLinkLoadingExample() {
  const [loading, setLoading] = React.useState(true);

  const openChange = (open: boolean) => {
    if (!open) return;
    setLoading(true);
    window.setTimeout(() => setLoading(false), 1200);
  };

  return (
    <Drawer.Root onOpenChange={openChange}>
      <Drawer.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Открыть по ссылке
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title loading={loading}>{INVOICE.title}</Drawer.Title>
          <Drawer.Description loading={loading}>{INVOICE.summary}</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Crossfade state={loading ? "loading" : "data"} aria-busy={loading}>
            <DescriptionList.Root>
              {INVOICE.facts.map(([term, value]) => (
                <DescriptionList.Item key={term} label={term}>
                  {loading ? <Skeleton /> : value}
                </DescriptionList.Item>
              ))}
            </DescriptionList.Root>
          </Crossfade>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close>
            <Button.Root variant="outline" tone="neutral">
              Закрыть
            </Button.Root>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
