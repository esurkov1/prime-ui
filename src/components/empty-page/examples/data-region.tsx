/** An empty data region: the empty state stretches over the rest of a card with a header — `layout`. */
import { PackagePlus } from "lucide-react";
import { Button, Card, EmptyPage } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function EmptyPageDataRegionExample() {
  return (
    <Card.Root role="region" aria-labelledby="orders-region-title" className={styles.region}>
      <Card.Header>
        <Card.Title id="orders-region-title">Заказы</Card.Title>
        <Button.Root variant="outline" tone="neutral" size="s">
          Импорт
        </Button.Root>
      </Card.Header>
      <EmptyPage.Root layout="fill" aria-labelledby="orders-empty-title">
        <EmptyPage.Icon tone="accent">
          <PackagePlus aria-hidden />
        </EmptyPage.Icon>
        <EmptyPage.Title id="orders-empty-title">Заказов пока нет</EmptyPage.Title>
        <EmptyPage.Description>
          Создайте заказ вручную или подключите магазин — заказы начнут появляться автоматически.
        </EmptyPage.Description>
        <EmptyPage.Actions>
          <Button.Root variant="outline" tone="neutral">
            Подключить магазин
          </Button.Root>
          <Button.Root>Создать заказ</Button.Root>
        </EmptyPage.Actions>
      </EmptyPage.Root>
    </Card.Root>
  );
}
