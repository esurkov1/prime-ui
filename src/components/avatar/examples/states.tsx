import { Avatar } from "@/components/avatar/Avatar";

import styles from "./examples.module.css";

const okSrc = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop";

/**
 * No `Avatar.Image` (idle), successful load, bad URL (error) — mirrors `playground/snippets/avatar/states.tsx`.
 */
export default function AvatarStatesExample() {
  return (
    <div className={styles.row}>
      <Avatar.Root size="xl">
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Image src={okSrc} alt="User" />
        <Avatar.Fallback>CD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size="xl">
        <Avatar.Image src="https://example.com/missing-avatar.png" alt="" />
        <Avatar.Fallback>!</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
