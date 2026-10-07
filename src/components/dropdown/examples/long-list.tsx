/** More projects than fit: the grouped list scrolls inside the panel, capped by the room next to the trigger — `Dropdown.Group`. */
import { Button, Dropdown } from "prime-ui-kit";

const RECENT = ["Сайт компании", "Платёжный шлюз"];

const PROJECTS = [
  "Мобильное приложение",
  "Личный кабинет",
  "Админ-панель",
  "Лендинг акции",
  "Справочный центр",
  "Внутренний портал",
  "Аналитика продаж",
  "CRM для партнёров",
  "Бот поддержки",
  "Дизайн-система",
];

export default function DropdownLongListExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger>
        <Button.Root variant="soft" tone="neutral">
          Переместить в проект
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group label="Недавние">
          {RECENT.map((name) => (
            <Dropdown.Item key={name}>{name}</Dropdown.Item>
          ))}
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group label="Все проекты">
          {PROJECTS.map((name) => (
            <Dropdown.Item key={name}>{name}</Dropdown.Item>
          ))}
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
