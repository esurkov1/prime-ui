/** The people of a contract on two lines: the name and the e-mail or role under it, the avatar spanning both; the approver opens the team to pick another — `Badge.Description`, `Badge.Avatar`, `Dropdown.Trigger`. */
import { Avatar, Badge, Dropdown, type PaletteColor } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Member = { id: string; name: string; initials: string; role: string; color: PaletteColor };

const TEAM: Member[] = [
  {
    id: "kotova",
    name: "Анна Котова",
    initials: "АК",
    role: "Юрист · Договорной отдел",
    color: "purple",
  },
  {
    id: "sokolov",
    name: "Илья Соколов",
    initials: "ИС",
    role: "Финансовый директор",
    color: "green",
  },
  {
    id: "morozova",
    name: "Мария Морозова",
    initials: "ММ",
    role: "Руководитель отдела продаж",
    color: "orange",
  },
];

const AUTHOR = {
  name: "Дмитрий Лебедев",
  initials: "ДЛ",
  email: "d.lebedev@sever-group.ru",
  color: "blue",
} as const;

export default function BadgePersonDetailsExample() {
  const [approverId, setApproverId] = React.useState("kotova");
  const approver = TEAM.find((item) => item.id === approverId) ?? TEAM[0];

  return (
    <div className={styles.badges}>
      <Badge.Root>
        <Badge.Avatar>
          <Avatar.Root color={AUTHOR.color}>
            <Avatar.Fallback>{AUTHOR.initials}</Avatar.Fallback>
          </Avatar.Root>
        </Badge.Avatar>
        {AUTHOR.name}
        <Badge.Description>{AUTHOR.email}</Badge.Description>
      </Badge.Root>
      {approver ? (
        <Dropdown.Root>
          <Dropdown.Trigger>
            <Badge.Root aria-label={`Согласует: ${approver.name}, ${approver.role}`}>
              <Badge.Avatar>
                <Avatar.Root color={approver.color}>
                  <Avatar.Fallback>{approver.initials}</Avatar.Fallback>
                </Avatar.Root>
              </Badge.Avatar>
              {approver.name}
              <Badge.Description>{approver.role}</Badge.Description>
            </Badge.Root>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {TEAM.map((item) => (
              <Dropdown.Item key={item.id} onSelect={() => setApproverId(item.id)}>
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
      ) : null}
    </div>
  );
}
