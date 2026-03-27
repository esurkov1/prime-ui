import { Avatar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const portrait =
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&h=128&fit=crop";

type Comment = { id: string; author: string; initials: string; body: string; src?: string };

const comments: Comment[] = [
  {
    id: "c1",
    author: "Casey Ng",
    initials: "CN",
    body: "Shipped the first cut of filters. Can you sanity-check the empty state?",
    src: portrait,
  },
  {
    id: "c2",
    author: "Riley Park",
    initials: "RP",
    body: "Looks good. Let’s add a single-line skeleton for slow networks.",
  },
  {
    id: "c3",
    author: "Morgan Blake",
    initials: "MB",
    body: "+1 on skeleton. I’ll wire it in the list cell tomorrow.",
    src: portrait,
  },
];

/**
 * Comment thread: avatar + stacked author line and body copy.
 */
export default function AvatarCommentThreadExample() {
  return (
    <ul className={styles.list} aria-label="Discussion">
      {comments.map((c) => (
        <li key={c.id} className={styles.rowStretch}>
          <Avatar.Root aria-label={c.author}>
            {c.src ? <Avatar.Image src={c.src} alt="" /> : null}
            <Avatar.Fallback>{c.initials}</Avatar.Fallback>
          </Avatar.Root>
          <div className={styles.stack}>
            <Typography.Root as="span" variant="body-small" weight="semibold">
              {c.author}
            </Typography.Root>
            <Typography.Root as="p" variant="body-default" tone="muted">
              {c.body}
            </Typography.Root>
          </div>
        </li>
      ))}
    </ul>
  );
}
