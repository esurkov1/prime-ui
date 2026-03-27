import { Avatar } from "@/components/avatar/Avatar";

import styles from "./examples.module.css";

const sampleSrc =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/**
 * Overlapping row of three avatars, group `size` cloned to children — mirrors `playground/snippets/avatar/group-three.tsx`.
 */
export default function AvatarGroupThreeExample() {
  return (
    <div className={styles.stack}>
      <Avatar.Group.Root size="xl">
        <Avatar.Root>
          <Avatar.Image src={sampleSrc} alt="" />
          <Avatar.Fallback>A</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>B</Avatar.Fallback>
        </Avatar.Root>
        <Avatar.Root>
          <Avatar.Fallback>C</Avatar.Fallback>
        </Avatar.Root>
      </Avatar.Group.Root>
    </div>
  );
}
