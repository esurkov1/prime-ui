import * as React from "react";
import { Avatar } from "@/components/avatar/Avatar";
import { Button } from "@/components/button/Button";

import styles from "./examples.module.css";

const sources = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&h=128&fit=crop",
] as const;

/**
 * Parent-owned `src`; image remounts per URL — mirrors `playground/snippets/avatar/src-from-state.tsx`.
 */
export default function AvatarSrcFromStateExample() {
  const [index, setIndex] = React.useState(0);
  const src = sources[index];

  return (
    <div className={styles.row}>
      <Avatar.Root size="xl">
        <Avatar.Image src={src} alt="" />
        <Avatar.Fallback>?</Avatar.Fallback>
      </Avatar.Root>
      <Button.Root
        mode="ghost"
        size="m"
        type="button"
        onClick={() => setIndex((i) => (i + 1) % sources.length)}
      >
        Next portrait
      </Button.Root>
    </div>
  );
}
