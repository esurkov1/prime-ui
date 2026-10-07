/** Content templates: a call to action, an events list and a campaign tile with a cover — `Card.Footer`, `Card.List`, `Card.Media`. */
import { Button, Card, LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = [
  { text: "Оплачен заказ № 4821", time: "12:04" },
  { text: "Новый отзыв на «Планшет Pro»", time: "11:47" },
  { text: "Синхронизация складов завершена", time: "10:30" },
];

export default function CardContentTemplatesExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="cta">
        <Card.Title>Экспорт отчёта</Card.Title>
        <Card.Description>
          Сводка по сегментам и метрикам за выбранный период в CSV или XLSX.
        </Card.Description>
        <Card.Footer>
          <Button.Root size="s">Скачать CSV</Button.Root>
          <Button.Root variant="ghost" tone="neutral" size="s">
            Настроить
          </Button.Root>
        </Card.Footer>
      </Card.Root>

      <Card.Root variant="list">
        <Card.Header>
          <Card.Title>Последние события</Card.Title>
          <LinkButton href="#" size="s">
            Все
          </LinkButton>
        </Card.Header>
        <Card.List>
          {EVENTS.map((e) => (
            <Card.ListItem key={e.text}>
              <span className={styles.listRow}>
                <Typography as="span" variant="body-m" truncate>
                  {e.text}
                </Typography>
                <Typography as="span" variant="caption" tone="muted" className={styles.listMeta}>
                  {e.time}
                </Typography>
              </span>
            </Card.ListItem>
          ))}
        </Card.List>
      </Card.Root>

      <Card.Root variant="cover">
        <Card.Media aria-hidden>
          <div className={styles.cover} />
        </Card.Media>
        <Card.Body>
          <Card.Title>Кампания «Осень»</Card.Title>
          <Card.Description>Охват и клики за 7 дней</Card.Description>
        </Card.Body>
        <Card.Footer>
          <Button.Root variant="outline" tone="neutral" size="s">
            Открыть отчёт
          </Button.Root>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
