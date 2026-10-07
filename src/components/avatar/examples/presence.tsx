/** `Avatar.Status` puts a presence dot on the avatar edge: online, away, busy, offline; the state name is announced from `labels`. Use in people lists and chats. */
import { Avatar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const people = [
  { initials: "АК", color: "blue", status: "online", caption: "в сети" },
  { initials: "ДН", color: "green", status: "away", caption: "отошёл" },
  { initials: "ЕО", color: "pink", status: "busy", caption: "занят" },
  { initials: "ИС", color: "gray", status: "offline", caption: "не в сети" },
] as const;

export default function AvatarPresenceExample() {
  return (
    <div className={styles.sizes}>
      {people.map((p) => (
        <div key={p.status} className={styles.sizeCell}>
          <Avatar.Root size="l" color={p.color}>
            <Avatar.Fallback>{p.initials}</Avatar.Fallback>
            <Avatar.Status status={p.status} />
          </Avatar.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {p.caption}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
