import { Avatar, LinkButton, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const portrait =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/**
 * App chrome: product title, nav links, and a signed-in identity cluster (avatar + account link).
 */
export default function AvatarAppHeaderNavExample() {
  return (
    <header className={styles.navBar}>
      <div className={styles.navCluster}>
        <Typography.Root as="span" variant="heading-subsection" weight="semibold">
          Prime Console
        </Typography.Root>
        <nav className={styles.row} aria-label="Primary">
          <LinkButton.Root href="#overview">Overview</LinkButton.Root>
          <LinkButton.Root href="#projects">Projects</LinkButton.Root>
          <LinkButton.Root href="#settings">Settings</LinkButton.Root>
        </nav>
      </div>
      <div className={styles.navUser}>
        <Avatar.Root aria-label="Signed in as Jamie Chen">
          <Avatar.Image src={portrait} alt="" />
          <Avatar.Fallback>JC</Avatar.Fallback>
        </Avatar.Root>
        <LinkButton.Root href="#account">Account</LinkButton.Root>
      </div>
    </header>
  );
}
