/** A presence dot on the avatar edge, announced by its state name — `Avatar.Status`, `labels`. */
import { Avatar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const PEOPLE = [
  { initials: "АК", color: "blue", status: "online", name: "Анна Климова" },
  { initials: "ДН", color: "green", status: "away", name: "Дмитрий Носов" },
  { initials: "ЕО", color: "pink", status: "busy", name: "Елена Орлова" },
  { initials: "ИС", color: "gray", status: "offline", name: "Игорь Савин" },
] as const;

export default function AvatarPresenceExample() {
  return (
    <ul className={styles.people}>
      {PEOPLE.map((person) => (
        <li key={person.status} className={styles.person}>
          <Avatar.Root color={person.color}>
            <Avatar.Fallback>{person.initials}</Avatar.Fallback>
            <Avatar.Status
              status={person.status}
              labels={person.status === "away" ? { away: "Отошёл до 15:00" } : undefined}
            />
          </Avatar.Root>
          <Typography as="span" variant="body-m">
            {person.name}
          </Typography>
        </li>
      ))}
    </ul>
  );
}
