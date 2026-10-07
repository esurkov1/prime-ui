/** Content cards: `cta` (title, text, actions), `list` (header + events with hairlines) and `cover` (media on top). Use for calls to action, activity lists and campaign tiles. */

import { Button, Card, LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const events = [
  { text: "Оплачен заказ № 4821", time: "12:04" },
  { text: "Новый отзыв на «Планшет Pro»", time: "11:47" },
  { text: "Синхронизация складов завершена", time: "10:30" },
];

export default function CardContentExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="cta">
        <Card.Title>Экспорт отчёта</Card.Title>
        <Card.CtaBody>
          Сводка по сегментам и метрикам за выбранный период в CSV или XLSX.
        </Card.CtaBody>
        <Card.Actions>
          <Button.Root size="s">Скачать CSV</Button.Root>
          <Button.Root variant="ghost" tone="neutral" size="s">
            Настроить
          </Button.Root>
        </Card.Actions>
      </Card.Root>

      <Card.Root variant="list">
        <Card.ListHeader>
          <Card.Title>Последние события</Card.Title>
          <LinkButton.Root href="#" size="s">
            Все
          </LinkButton.Root>
        </Card.ListHeader>
        <Card.List>
          {events.map((e) => (
            <Card.ListItem key={e.text}>
              <span className={styles.listRow}>
                <Typography.Root as="span" variant="body-m" truncate>
                  {e.text}
                </Typography.Root>
                <Typography.Root
                  as="span"
                  variant="caption"
                  tone="muted"
                  className={styles.listMeta}
                >
                  {e.time}
                </Typography.Root>
              </span>
            </Card.ListItem>
          ))}
        </Card.List>
      </Card.Root>

      <Card.Root variant="cover">
        <Card.Cover aria-hidden>
          <div className={styles.cover} />
        </Card.Cover>
        <Card.Stack>
          <Card.Title>Кампания «Осень»</Card.Title>
          <Card.Label>Охват и клики за 7 дней</Card.Label>
        </Card.Stack>
        <Card.Actions>
          <Button.Root variant="outline" tone="neutral" size="s">
            Открыть отчёт
          </Button.Root>
        </Card.Actions>
      </Card.Root>
    </div>
  );
}
