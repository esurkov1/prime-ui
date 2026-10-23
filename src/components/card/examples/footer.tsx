/** What the footer holds: the total and two buttons with the accent one last, an assignee picker as tall as the button beside it, and buttons that share the width with nothing at the start — `Card.Total`, `Select.Root`, `fullWidth`. */
import { Avatar, Button, Card, DescriptionList, type PaletteColor, Select } from "prime-ui-kit";

import styles from "./examples.module.css";

type Member = { value: string; name: string; initials: string; color: PaletteColor };

const TEAM: Member[] = [
  { value: "kotova", name: "Анна Котова", initials: "АК", color: "purple" },
  { value: "sokolov", name: "Илья Соколов", initials: "ИС", color: "green" },
  { value: "morozova", name: "Мария Морозова", initials: "ММ", color: "orange" },
];

const BY_VALUE = new Map(TEAM.map((member) => [member.value, member]));

export default function CardFooterExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Header>
          <Card.Title>Счёт № 2026-0418</Card.Title>
          <Card.Description>Выставлен 7 окт.</Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Клиент">ООО «Гранит»</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
        <Card.Footer>
          <Card.Total label="К оплате" tone="warning">
            256 000 ₽
          </Card.Total>
          <Card.Actions>
            <Button.Root variant="soft" tone="neutral">
              Скачать
            </Button.Root>
            <Button.Root>Оплатить</Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Подготовить договор</Card.Title>
          <Card.Description>Задача T-118 · до 12 окт.</Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Проект">Внедрение CRM</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
        <Card.Footer>
          <Select.Root defaultValue="kotova">
            <Select.Trigger aria-label="Ответственный">
              <Select.Value
                renderValue={({ value, label }) => {
                  const member = BY_VALUE.get(value);
                  return (
                    <>
                      <Avatar.Root color={member?.color}>
                        <Avatar.Fallback>{member?.initials}</Avatar.Fallback>
                      </Avatar.Root>
                      <Select.ItemText>{label}</Select.ItemText>
                    </>
                  );
                }}
              />
            </Select.Trigger>
            <Select.Content>
              {TEAM.map((member) => (
                <Select.Item key={member.value} value={member.value}>
                  <Avatar.Root color={member.color}>
                    <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                  </Avatar.Root>
                  <Select.ItemText>{member.name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Card.Actions>
            <Button.Root>Взять в работу</Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>
      <Card.Root>
        <Card.Header>
          <Card.Title>Тариф «Команда»</Card.Title>
          <Card.Description>12 мест, отчёты и API</Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Цена">4 900 ₽ / мес.</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
        <Card.Footer>
          <Card.Actions fullWidth>
            <Button.Root variant="soft" tone="neutral">
              Сравнить
            </Button.Root>
            <Button.Root>Подключить</Button.Root>
          </Card.Actions>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
