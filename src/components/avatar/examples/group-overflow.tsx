import { Avatar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const portrait =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/**
 * Overlapping group with an overflow cell for hidden participants.
 */
export default function AvatarGroupOverflowExample() {
  return (
    <div className={styles.stack}>
      <Typography as="p" variant="body-small" tone="muted">
        Design review — 5 invited, 2 faces shown
      </Typography>
      <Avatar.Group.Root
        size="l"
        aria-label="Participants: two avatars visible, three more not shown"
      >
        <Avatar.Root>
          <Avatar.Image src={portrait} alt="" />
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Group.Overflow aria-label="Three additional participants">+3</Avatar.Group.Overflow>
      </Avatar.Group.Root>
    </div>
  );
}
