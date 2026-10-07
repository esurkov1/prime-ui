/** Team card: a group in the header and a member list with `m` avatars and presence; `--avatar-ring` matches the card fill. Use for team and project overviews. */

import { Avatar, type PaletteColor, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const members: {
  name: string;
  role: string;
  initials: string;
  color: PaletteColor;
  online: boolean;
}[] = [
  {
    name: "Анна Климова",
    role: "Руководитель проекта",
    initials: "АК",
    color: "blue",
    online: true,
  },
  {
    name: "Дмитрий Носов",
    role: "Фронтенд-разработчик",
    initials: "ДН",
    color: "green",
    online: true,
  },
  { name: "Елена Орлова", role: "Дизайнер", initials: "ЕО", color: "pink", online: false },
];

export default function AvatarTeamCardExample() {
  const titleId = React.useId();

  return (
    <section className={styles.team} aria-labelledby={titleId}>
      <div className={styles.teamHeader}>
        <Typography.Root as="h3" variant="title-s" id={titleId}>
          Команда «Витрина»
        </Typography.Root>
        <Avatar.Group.Root size="s" className={styles.teamGroup} aria-label="Всего 8 участников">
          {members.map((m) => (
            <Avatar.Root key={m.name} color={m.color}>
              <Avatar.Fallback>{m.initials}</Avatar.Fallback>
            </Avatar.Root>
          ))}
          <Avatar.Group.Overflow aria-label="Ещё 5 участников">+5</Avatar.Group.Overflow>
        </Avatar.Group.Root>
      </div>
      <ul className={styles.members}>
        {members.map((m) => (
          <li key={m.name} className={styles.member}>
            <Avatar.Root color={m.color}>
              <Avatar.Fallback>{m.initials}</Avatar.Fallback>
              <Avatar.Status status={m.online ? "online" : "offline"} />
            </Avatar.Root>
            <span className={styles.memberText}>
              <Typography.Root as="span" variant="title-s" truncate>
                {m.name}
              </Typography.Root>
              <Typography.Root as="span" variant="body-s" tone="muted">
                {m.role}
              </Typography.Root>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
