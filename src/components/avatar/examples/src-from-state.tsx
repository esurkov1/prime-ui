/** Changing `src` restarts loading; initials show until the new photo arrives. Use when the photo comes from state (upload, profile switch). */

import { Avatar, Button } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const sources = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=128&h=128&fit=crop",
] as const;

export default function AvatarSrcFromStateExample() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className={styles.row}>
      <Avatar.Root size="xl" color="sky">
        <Avatar.Image src={sources[index]} alt="" />
        <Avatar.Fallback>ИП</Avatar.Fallback>
      </Avatar.Root>
      <Button.Root
        variant="outline"
        tone="neutral"
        onClick={() => setIndex((i) => (i + 1) % sources.length)}
      >
        Сменить фото
      </Button.Root>
    </div>
  );
}
