/** A long grouped list that scrolls inside the panel, with a disabled row skipped by arrow keys. Use when a menu has more items than fit the panel max height. */
import { Button, Dropdown } from "prime-ui-kit";

const PROJECTS = [
  "Сайт компании",
  "Мобильное приложение",
  "Личный кабинет",
  "Админ-панель",
  "Лендинг акции",
  "Платёжный шлюз",
  "Справочный центр",
  "Внутренний портал",
  "Аналитика продаж",
  "CRM для партнёров",
  "Бот поддержки",
  "Дизайн-система",
];

export default function DropdownStatesExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Переместить в проект
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.GroupLabel>Недавние</Dropdown.GroupLabel>
          <Dropdown.Item>Сайт компании</Dropdown.Item>
          <Dropdown.Item disabled>Архив 2023 — только чтение</Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.GroupLabel>Все проекты</Dropdown.GroupLabel>
          {PROJECTS.map((name) => (
            <Dropdown.Item key={name}>{name}</Dropdown.Item>
          ))}
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
