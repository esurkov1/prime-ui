/** A presence dot on the avatar edge: each state has its own shape and color and is announced by its name — `Avatar.Status`, `labels`. */
import { Avatar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=128&h=128&fit=crop`;

const PEOPLE = [
  {
    initials: "АК",
    color: "blue",
    status: "online",
    name: "Анна Климова",
    src: photo("1534528741775-53994a69daeb"),
  },
  { initials: "ДН", color: "green", status: "away", name: "Дмитрий Носов" },
  {
    initials: "ЕО",
    color: "pink",
    status: "busy",
    name: "Елена Орлова",
    src: photo("1580489944761-15a19d654956"),
  },
  { initials: "ИС", color: "gray", status: "offline", name: "Игорь Савин" },
] as const;

export default function AvatarPresenceExample() {
  return (
    <div className={styles.people}>
      {PEOPLE.map((person) => (
        <div key={person.status} className={styles.person}>
          <Avatar.Root color={person.color}>
            {"src" in person ? <Avatar.Image src={person.src} /> : null}
            <Avatar.Fallback>{person.initials}</Avatar.Fallback>
            <Avatar.Status
              status={person.status}
              labels={person.status === "away" ? { away: "Отошёл до 15:00" } : undefined}
            />
          </Avatar.Root>
          <Typography as="span" variant="body-m">
            {person.name}
          </Typography>
        </div>
      ))}
    </div>
  );
}
