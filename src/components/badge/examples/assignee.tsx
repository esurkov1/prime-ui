/** The assignee of a task as a person's chip that opens the team: the avatar leads the name, and with nobody assigned an outline call to assign stands in its place — `Badge.Avatar`, `Dropdown.Trigger`, `variant`. */
import { Avatar, Badge, Dropdown, type PaletteColor, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Member = { id: string; name: string; initials: string; color: PaletteColor };

const TEAM: Member[] = [
  { id: "kotova", name: "Анна Котова", initials: "АК", color: "purple" },
  { id: "sokolov", name: "Илья Соколов", initials: "ИС", color: "green" },
  { id: "morozova", name: "Мария Морозова", initials: "ММ", color: "orange" },
];

export default function BadgeAssigneeExample() {
  const [memberId, setMemberId] = React.useState<string | null>("kotova");
  const member = TEAM.find((item) => item.id === memberId);

  return (
    <div className={styles.badges}>
      <Typography as="span" variant="caption" tone="muted">
        Задача T-118 · Подготовить договор
      </Typography>
      <Dropdown.Root>
        <Dropdown.Trigger>
          {member ? (
            <Badge.Root aria-label={`Ответственный: ${member.name}`}>
              <Badge.Avatar>
                <Avatar.Root color={member.color}>
                  <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                </Avatar.Root>
              </Badge.Avatar>
              {member.name}
            </Badge.Root>
          ) : (
            <Badge.Root variant="outline">Назначить</Badge.Root>
          )}
        </Dropdown.Trigger>
        <Dropdown.Content>
          {TEAM.map((item) => (
            <Dropdown.Item
              key={item.id}
              selected={item.id === memberId}
              onSelect={() => setMemberId(item.id)}
            >
              <Avatar.Root color={item.color}>
                <Avatar.Fallback>{item.initials}</Avatar.Fallback>
              </Avatar.Root>
              {item.name}
            </Dropdown.Item>
          ))}
          <Dropdown.Separator />
          <Dropdown.Item onSelect={() => setMemberId(null)}>Снять ответственного</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}
