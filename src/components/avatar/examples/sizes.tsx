import { Avatar, type AvatarSize } from "@/components/avatar/Avatar";

import styles from "./examples.module.css";

const sampleSrc =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&h=256&fit=crop";

const sizes: AvatarSize[] = ["s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];

/**
 * Full `size` scale in one row — mirrors `playground/snippets/avatar/sizes.tsx`.
 */
export default function AvatarSizesExample() {
  return (
    <div className={styles.row}>
      {sizes.map((size) => (
        <Avatar.Root key={size} size={size}>
          <Avatar.Image src={sampleSrc} alt="" />
          <Avatar.Fallback>{size}</Avatar.Fallback>
        </Avatar.Root>
      ))}
    </div>
  );
}
