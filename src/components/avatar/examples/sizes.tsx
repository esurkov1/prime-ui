/** Six diameters: 20 · 24 · 32 · 40 · 48 · 64 px, default `m`; initials take 40% of the diameter. Use xs in dense tables, m in lists, xl/2xl in profile headers. */
import { Avatar, type AvatarSize, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: AvatarSize[] = ["xs", "s", "m", "l", "xl", "2xl"];

export default function AvatarSizesExample() {
  return (
    <div className={styles.sizes}>
      {sizes.map((size) => (
        <div key={size} className={styles.sizeCell}>
          <Avatar.Root size={size} color="blue" aria-label="Анна Климова">
            <Avatar.Fallback>АК</Avatar.Fallback>
          </Avatar.Root>
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
