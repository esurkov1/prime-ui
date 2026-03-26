import { Avatar, Icon, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const portrait =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/**
 * Side-by-side: loaded image, initials-only fallback, and icon-only fallback.
 */
export default function AvatarFallbackVariantsExample() {
  return (
    <div className={styles.stack}>
      <Typography as="p" variant="caption" tone="muted">
        Same size tier; different fallback strategies
      </Typography>
      <div className={styles.row}>
        <Avatar.Root size="xl" aria-label="User with photo">
          <Avatar.Image src={portrait} alt="" />
          <Avatar.Fallback>PH</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root size="xl" aria-label="User with initials only">
          <Avatar.Fallback>IN</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root size="xl" aria-label="Placeholder account">
          <Avatar.Fallback>
            <Icon name="field.email" size="xl" tone="subtle" />
          </Avatar.Fallback>
        </Avatar.Root>
      </div>
    </div>
  );
}
