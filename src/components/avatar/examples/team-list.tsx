import { Avatar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const portrait =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

type Member = { id: string; name: string; role: string; src?: string };

const members: Member[] = [
  { id: "1", name: "Alex Morgan", role: "Design lead", src: portrait },
  { id: "2", name: "Jordan Lee", role: "Engineer" },
  { id: "3", name: "Sam Rivera", role: "PM", src: portrait },
];

/**
 * Team roster: each row pairs Avatar with Typography; missing photo falls back to initials.
 */
export default function AvatarTeamListExample() {
  return (
    <ul className={styles.list} aria-label="Team members">
      {members.map((m) => (
        <li key={m.id} className={styles.listItem}>
          <Avatar.Root size="l" aria-label={m.name}>
            {m.src ? <Avatar.Image src={m.src} alt="" /> : null}
            <Avatar.Fallback>
              {m.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </Avatar.Fallback>
          </Avatar.Root>
          <div className={styles.listItemBody}>
            <Typography.Root as="span" variant="body-default" weight="medium">
              {m.name}
            </Typography.Root>
            <Typography.Root as="span" variant="caption" tone="muted">
              {m.role}
            </Typography.Root>
          </div>
        </li>
      ))}
    </ul>
  );
}
