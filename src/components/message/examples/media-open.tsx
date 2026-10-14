/** The album's viewer owned by the screen: a button opens the acceptance photos at the damaged pallet, and the page the viewer shows is kept for the next open — `Message.Media`, `open`, `onOpenChange`, `index`, `onIndexChange`. */
import { Button, type GalleryItem, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const ACCEPTANCE: GalleryItem[] = [
  { src: "https://picsum.photos/seed/accept-1/800/600", width: 800, height: 600, alt: "Паллета 1" },
  { src: "https://picsum.photos/seed/accept-2/800/600", width: 800, height: 600, alt: "Паллета 2" },
  {
    src: "https://picsum.photos/seed/accept-3/600/800",
    width: 600,
    height: 800,
    alt: "Паллета 3, повреждена упаковка",
  },
];

const DAMAGED = 2;

export default function MessageMediaOpenExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="11:40">
        <Message.Media
          items={ACCEPTANCE}
          open={open}
          onOpenChange={setOpen}
          index={index}
          onIndexChange={setIndex}
        />
        <Message.Text>Приёмка по заказу ORD-7310: на третьей паллете порвана плёнка.</Message.Text>
      </Message.Root>
      <Button.Root
        variant="soft"
        tone="neutral"
        onClick={() => {
          setIndex(DAMAGED);
          setOpen(true);
        }}
      >
        Показать повреждение
      </Button.Root>
    </div>
  );
}
