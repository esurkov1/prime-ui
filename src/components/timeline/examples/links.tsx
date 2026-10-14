/** Rows that open something: an operation page by a link or by your router link through the slot, a receipt in place by a button; one Tab stop each with a focus ring — `href`, `asChild`, `onClick`. */
import { Button, Drawer, Timeline } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const OPERATIONS = [
  { id: "rent-ivan", title: "Аренда закончилась · Иван К.", date: "21.09.26", value: "+6 300 ₽" },
  { id: "oil", title: "ТО: замена масла", date: "10.09.26", value: "−689 ₽" },
];

const WASH = { title: "Мойка и химчистка салона", date: "01.09.26", value: "−450 ₽" };

export default function TimelineLinksExample() {
  const [receiptOpen, setReceiptOpen] = React.useState(false);

  return (
    <>
      <Timeline.Root className={styles.feed}>
        <Timeline.Group label="Операции">
          {OPERATIONS.map((operation) => (
            <Timeline.Item key={operation.id} href={`#${operation.id}`}>
              <Timeline.ItemTitle>{operation.title}</Timeline.ItemTitle>
              <Timeline.ItemMeta>
                <strong>{operation.date}</strong>
              </Timeline.ItemMeta>
              <Timeline.ItemValue>{operation.value}</Timeline.ItemValue>
            </Timeline.Item>
          ))}
          {/* The receipt opens in place: the row is a button. */}
          <Timeline.Item onClick={() => setReceiptOpen(true)}>
            <Timeline.ItemTitle>{WASH.title}</Timeline.ItemTitle>
            <Timeline.ItemMeta>
              <strong>{WASH.date}</strong> · чек
            </Timeline.ItemMeta>
            <Timeline.ItemValue>{WASH.value}</Timeline.ItemValue>
          </Timeline.Item>
          {/* A router link (`<Link to>`) goes in the same way. */}
          <Timeline.Item asChild>
            <a href="#operations-archive">
              <Timeline.ItemTitle>Операции за август</Timeline.ItemTitle>
              <Timeline.ItemMeta>
                <strong>14 операций</strong>
              </Timeline.ItemMeta>
            </a>
          </Timeline.Item>
        </Timeline.Group>
      </Timeline.Root>

      <Drawer.Root open={receiptOpen} onOpenChange={setReceiptOpen}>
        <Drawer.Content size="s">
          <Drawer.Header>
            <Drawer.Title>{WASH.title}</Drawer.Title>
            <Drawer.Description>
              Чек от {WASH.date} · {WASH.value}
            </Drawer.Description>
          </Drawer.Header>
          <Drawer.Footer>
            <Drawer.Close>
              <Button.Root variant="outline" tone="neutral">
                Закрыть
              </Button.Root>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
}
