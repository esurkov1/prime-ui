/** The viewer owned by the screen: a button opens the album at its third item, the page the viewer shows is kept, and closing returns the focus to where it came from — `open`, `onOpenChange`, `index`, `onIndexChange`. */
import { Button, Gallery, type GalleryItem, Typography } from "prime-ui-kit";
import * as React from "react";

const REPORT: GalleryItem[] = [
  { src: "https://picsum.photos/seed/act-1/800/600", width: 800, height: 600, alt: "Акт, стр. 1" },
  { src: "https://picsum.photos/seed/act-2/600/800", width: 600, height: 800, alt: "Акт, стр. 2" },
  { src: "https://picsum.photos/seed/act-3/800/600", width: 800, height: 600, alt: "Повреждение" },
  { src: "https://picsum.photos/seed/act-4/800/800", width: 800, height: 800, alt: "Пломба" },
];

export default function GalleryControlledOpenExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  return (
    <>
      <Gallery
        items={REPORT}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
      <Button.Root
        variant="soft"
        tone="neutral"
        onClick={() => {
          setIndex(2);
          setOpen(true);
        }}
      >
        Показать повреждение
      </Button.Root>
      <Typography as="span" variant="caption" tone="muted">
        Последнее открытое: {REPORT[index]?.alt}
      </Typography>
    </>
  );
}
