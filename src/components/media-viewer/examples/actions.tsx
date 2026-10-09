/** Photos of a listing with actions for the one on screen: download it or make it the cover — `renderActions`. */
import {
  Button,
  Icon,
  MediaViewer,
  type MediaViewerItem,
  Thumbnail,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const photo = (id: string, width: number, height: number) =>
  `https://picsum.photos/seed/listing-${id}/${width}/${height}`;

const PHOTOS: MediaViewerItem[] = [
  { src: photo("hall", 1600, 1067), width: 1600, height: 1067, alt: "Склад, общий вид" },
  { src: photo("office", 1600, 1067), width: 1600, height: 1067, alt: "Офис на втором этаже" },
  { src: photo("gates", 1600, 1067), width: 1600, height: 1067, alt: "Ворота с докшелтерами" },
];

export default function MediaViewerActionsExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [cover, setCover] = React.useState(PHOTOS[0]?.src);

  return (
    <>
      <Typography variant="body-s" tone="secondary">
        Обложка объявления: {PHOTOS.find((item) => item.src === cover)?.alt}
      </Typography>
      <div className={styles.grid}>
        {PHOTOS.map((item, at) => (
          <Thumbnail.Root key={item.src} asChild ratio="3:2" fullWidth>
            <button
              type="button"
              aria-label={`Открыть фото: ${item.alt}`}
              onClick={() => {
                setIndex(at);
                setOpen(true);
              }}
            >
              <Thumbnail.Image src={item.src} />
              <Thumbnail.Fallback>
                <Icon name="object.image" />
              </Thumbnail.Fallback>
            </button>
          </Thumbnail.Root>
        ))}
      </div>
      <MediaViewer
        items={PHOTOS}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
        renderActions={(item) => (
          <>
            <Button.Root
              shape="circle"
              variant="shade"
              aria-label="Сделать обложкой"
              aria-pressed={item.src === cover}
              onClick={() => setCover(item.src)}
            >
              <Button.Icon>
                <Icon
                  name="status.favorite"
                  fill={item.src === cover ? "currentColor" : undefined}
                />
              </Button.Icon>
            </Button.Root>
            <Button.Root shape="circle" variant="shade" aria-label="Скачать фото" asChild>
              <a href={item.src} download>
                <Button.Icon>
                  <Icon name="action.download" />
                </Button.Icon>
              </a>
            </Button.Root>
          </>
        )}
      />
    </>
  );
}
