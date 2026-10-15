/** A record card that opens before its data arrives: the title comes from the list row, the line under it and the body hold their place in skeletons, then the data fades in — `Drawer.Description`, `loading`. */
import { Button, Crossfade, DescriptionList, Drawer, Skeleton } from "prime-ui-kit";
import * as React from "react";

const BIKE = {
  title: "Велосипед №214",
  summary: "Тур 2 · на линии с 6 октября",
  facts: [
    ["Модель", "Tour 2, рама M"],
    ["Пробег", "1 840 км"],
    ["Последнее ТО", "28 сентября"],
    ["Арендатор", "Илья Морозов"],
  ],
};

export default function DrawerLoadingExample() {
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
          Открыть велосипед
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{BIKE.title}</Drawer.Title>
          <Drawer.Description loading={loading}>{BIKE.summary}</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          <Crossfade state={loading ? "loading" : "data"} aria-busy={loading}>
            <DescriptionList.Root>
              {BIKE.facts.map(([term, value]) => (
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
