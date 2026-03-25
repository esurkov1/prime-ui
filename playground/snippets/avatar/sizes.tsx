import { Avatar, type AvatarSize } from "@/components/avatar/Avatar";

import styles from "./sizes.module.css";

const sampleSrc =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&h=256&fit=crop";

const sizes: AvatarSize[] = ["s", "m", "l", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];

export default function AvatarSizesSnippet() {
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
