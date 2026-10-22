/** Which zones a card has and where its buttons go: a header with its actions, a body, a footer row of buttons, a list and a cover picture on top — `Card.Header`, `Card.Actions`, `Card.Body`, `Card.Footer`, `Card.List`, `Card.Media`. */
import { Button, Card, LinkButton, Switch, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const EVENTS = [
  { text: "Оплачен счёт № 4821", time: "12:04" },
  { text: "Новый клиент «Гранит»", time: "11:47" },
  { text: "Выгрузка в 1С завершена", time: "10:30" },
];

export default function CardStructureExample() {
  return (
    <div className={styles.panel}>
      <div className={styles.stack}>
        <Card.Root>
          <Card.Header>
            <Card.Title>Выгрузка в 1С</Card.Title>
            <Card.Description>Каждые 15 минут</Card.Description>
            <Card.Actions>
              <Switch.Root defaultChecked aria-label="Выгружать в 1С" />
            </Card.Actions>
          </Card.Header>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Тариф «Команда»</Card.Title>
            <Card.Actions>
              <Button.Root variant="soft" tone="neutral">
                Сменить
              </Button.Root>
            </Card.Actions>
          </Card.Header>
          <Card.Body>
            <Typography as="p" variant="body-s" tone="secondary">
              До 25 сотрудников и 100 ГБ файлов. Следующее списание 1 ноября — 12 000 ₽.
            </Typography>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Экспорт отчёта</Card.Title>
            <Card.Description>Сводка по клиентам за квартал</Card.Description>
          </Card.Header>
          <Card.Body>
            <Typography as="p" variant="body-s" tone="secondary">
              Выручка, оплаты и долги по каждому клиенту в одной таблице.
            </Typography>
          </Card.Body>
          <Card.Footer>
            <Button.Root variant="soft" tone="neutral">
              Настроить
            </Button.Root>
            <Button.Root>Скачать XLSX</Button.Root>
          </Card.Footer>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>Последние события</Card.Title>
            <Card.Actions>
              <LinkButton href="#events">Все</LinkButton>
            </Card.Actions>
          </Card.Header>
          <Card.List>
            {EVENTS.map((event) => (
              <Card.ListItem key={event.text}>
                <span className={styles.listRow}>
                  <Typography as="span" variant="body-m" truncate>
                    {event.text}
                  </Typography>
                  <Typography
                    as="span"
                    variant="caption"
                    tone="muted"
                    numeric="tabular"
                    className={styles.listMeta}
                  >
                    {event.time}
                  </Typography>
                </span>
              </Card.ListItem>
            ))}
          </Card.List>
        </Card.Root>

        <Card.Root>
          <Card.Media aria-hidden>
            <img src="https://picsum.photos/seed/autumn-campaign/640/320" alt="" />
          </Card.Media>
          <Card.Header>
            <Card.Title>Кампания «Осень»</Card.Title>
            <Card.Description>Охват и клики за 7 дней</Card.Description>
          </Card.Header>
          <Card.Footer>
            <Button.Root variant="soft" tone="neutral">
              Открыть отчёт
            </Button.Root>
          </Card.Footer>
        </Card.Root>
      </div>
    </div>
  );
}
