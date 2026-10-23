/** What a header holds: four marks, badges that fold into a count on a narrow card, and controls by zone — a more menu alone with a footer, neutral buttons and a menu without one, a value picker — `Card.Icon`, `Card.Badges`, `StatusDot`, `Card.Actions`, `Select.Root`. */
import {
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Icon,
  ProgressCircle,
  Select,
  StatusDot,
  Thumbnail,
} from "prime-ui-kit";

import styles from "./examples.module.css";

const PHOTO = "https://picsum.photos/seed/nmax-card/160/160";

const STAGES = [
  { value: "new", label: "Новая", color: "gray" },
  { value: "work", label: "В работе", color: "blue" },
  { value: "done", label: "Выполнена", color: "green" },
] as const;

export default function CardHeaderExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Avatar.Root color="purple">
              <Avatar.Fallback>АК</Avatar.Fallback>
            </Avatar.Root>
          </Card.Icon>
          <Card.Title>Анна Котова</Card.Title>
          <Card.Description>Менеджер по продажам</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.receipt" />
          </Card.Icon>
          <Card.Title>Счёт № 2026-0418</Card.Title>
          <Card.Description>
            <StatusDot tone="success">Оплачен</StatusDot>7 окт.
          </Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <ProgressCircle value={72} aria-label="Срок аренды: 72%" />
          </Card.Icon>
          <Card.Title>Аренда Yamaha NMAX</Card.Title>
          <Card.Description>Осталось 8 дней</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Thumbnail.Root>
              <Thumbnail.Image src={PHOTO} />
              <Thumbnail.Fallback>
                <Icon name="object.motorbike" />
              </Thumbnail.Fallback>
            </Thumbnail.Root>
          </Card.Icon>
          <Card.Title>Yamaha NMAX 155</Card.Title>
          <Card.Description>А 123 ВС 777 · пробег 3 200 км</Card.Description>
        </Card.Header>
      </Card.Root>
      <div className={styles.phone}>
        <Card.Root>
          <Card.Header>
            <Card.Icon>
              <Icon name="object.truck" />
            </Card.Icon>
            <Card.Title>Поставка № 318</Card.Title>
            <Card.Badges>
              <Badge.Root tone="warning">Срочно</Badge.Root>
              <Badge.Root>Опт</Badge.Root>
              <Badge.Root>Холодильник</Badge.Root>
              <Badge.Root>Хрупкое</Badge.Root>
              <Badge.Root>Страховка</Badge.Root>
            </Card.Badges>
            <Card.Description>Склад «Север» · 9 окт.</Card.Description>
          </Card.Header>
        </Card.Root>
      </div>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.document" />
          </Card.Icon>
          <Card.Title>Договор № 118</Card.Title>
          <Card.Description>
            <StatusDot tone="success">Действует</StatusDot>до 31 дек.
          </Card.Description>
          <Card.Actions>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="soft" tone="neutral" aria-label="Ещё">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <Dropdown.Item>Открыть договор</Dropdown.Item>
                <Dropdown.Item>Скачать PDF</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Card.Actions>
        </Card.Header>
        <Card.Footer>
          <Card.Total label="Сумма">1 240 000 ₽</Card.Total>
          <Card.Actions>
            <Button.Root>Продлить</Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>
      <Card.Root className={styles.wide}>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.users" />
          </Card.Icon>
          <Card.Title>Команда продаж</Card.Title>
          <Card.Description>8 человек</Card.Description>
          <Card.Actions>
            <Button.Root variant="soft" tone="neutral">
              <Button.Icon>
                <Icon name="action.add" />
              </Button.Icon>
              Пригласить
            </Button.Root>
            <Dropdown.Root>
              <Dropdown.Trigger>
                <Button.Root variant="soft" tone="neutral" aria-label="Ещё">
                  <Button.Icon>
                    <Icon name="action.more" />
                  </Button.Icon>
                </Button.Root>
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <Dropdown.Item>Настройки команды</Dropdown.Item>
                <Dropdown.Item>Выгрузить список</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </Card.Actions>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Icon>
            <Icon name="object.tasks" />
          </Card.Icon>
          <Card.Title>Подготовить договор</Card.Title>
          <Card.Description>Задача T-118 · до 12 окт.</Card.Description>
          <Card.Actions>
            <Select.Root defaultValue="work">
              <Select.Trigger aria-label="Стадия задачи">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {STAGES.map((stage) => (
                  <Select.Item key={stage.value} value={stage.value} color={stage.color}>
                    {stage.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Card.Actions>
        </Card.Header>
      </Card.Root>
    </div>
  );
}
