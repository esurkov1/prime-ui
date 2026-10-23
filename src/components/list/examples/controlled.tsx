/** A choice held by the screen: several watchers with checkboxes (a checked row in the accent's soft tone), and one role with a check at the end — `value`, `onValueChange`, `multiple`, `indicator`. */
import { Avatar, Card, Icon, List, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PEOPLE = [
  {
    id: "belova",
    name: "Ирина Белова",
    role: "Юрист · ООО «Гранит»",
    initials: "ИБ",
    color: "blue",
  },
  {
    id: "orlov",
    name: "Павел Орлов",
    role: "Менеджер · ООО «Лето»",
    initials: "ПО",
    color: "green",
  },
  {
    id: "kozlov",
    name: "Сергей Козлов",
    role: "Бухгалтер · ИП Козлов",
    initials: "СК",
    color: "orange",
  },
] as const;

const ROLES = [
  { id: "viewer", name: "Наблюдатель", note: "Только просмотр", icon: "object.user" },
  { id: "editor", name: "Редактор", note: "Меняет сделки и клиентов", icon: "action.edit" },
  { id: "admin", name: "Администратор", note: "Всё, включая доступы", icon: "object.key" },
] as const;

export default function ListControlledExample() {
  const [watchers, setWatchers] = React.useState<string[]>(["belova", "kozlov"]);
  const [role, setRole] = React.useState<string>("editor");

  return (
    <Card.Root className={styles.pane}>
      <Card.Body>
        <List.Root
          aria-label="Наблюдатели"
          multiple
          indicator="start"
          value={watchers}
          onValueChange={(next) => setWatchers(Array.isArray(next) ? next : [])}
        >
          {PEOPLE.map((person) => (
            <List.Item key={person.id} value={person.id}>
              <List.ItemIcon>
                <Avatar.Root color={person.color}>
                  <Avatar.Fallback>{person.initials}</Avatar.Fallback>
                </Avatar.Root>
              </List.ItemIcon>
              <List.ItemText>{person.name}</List.ItemText>
              <List.ItemDescription>{person.role}</List.ItemDescription>
            </List.Item>
          ))}
        </List.Root>
        <Typography as="p" variant="caption" tone="muted">
          Наблюдателей: {watchers.length}
        </Typography>
        <List.Root
          aria-label="Роль"
          value={role}
          onValueChange={(next) => setRole(typeof next === "string" ? next : role)}
        >
          {ROLES.map((item) => (
            <List.Item key={item.id} value={item.id}>
              <List.ItemIcon>
                <Icon name={item.icon} />
              </List.ItemIcon>
              <List.ItemText>{item.name}</List.ItemText>
              <List.ItemDescription>{item.note}</List.ItemDescription>
            </List.Item>
          ))}
        </List.Root>
      </Card.Body>
    </Card.Root>
  );
}
