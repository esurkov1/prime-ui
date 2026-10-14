/** The album with a viewer of the screen's own: a tile reports its item, and the inspection card beside it shows which photo is open — `viewer`, `index`, `onIndexChange`. */
import { Card, Gallery, type GalleryItem, Typography } from "prime-ui-kit";
import * as React from "react";

const INSPECTION: GalleryItem[] = [
  {
    src: "https://picsum.photos/seed/pallet-front/800/600",
    width: 800,
    height: 600,
    alt: "Паллета, фронт",
  },
  {
    src: "https://picsum.photos/seed/pallet-side/800/600",
    width: 800,
    height: 600,
    alt: "Паллета, бок",
  },
  {
    src: "https://picsum.photos/seed/pallet-label/600/800",
    width: 600,
    height: 800,
    alt: "Этикетка",
  },
];

export default function GalleryControlledExample() {
  const [index, setIndex] = React.useState(0);
  return (
    <>
      <Gallery items={INSPECTION} viewer={false} index={index} onIndexChange={setIndex} />
      <Card.Root>
        <Card.Body>
          <Typography as="span" variant="body-s" aria-live="polite">
            Открыто в карточке приёмки: {INSPECTION[index]?.alt}
          </Typography>
        </Card.Body>
      </Card.Root>
    </>
  );
}
