/** Photos of an acceptance open full-screen from their thumbnails, at the one that was pressed — `items`, `open`, `index`. */
import { Icon, MediaViewer, type MediaViewerItem, Thumbnail } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const photo = (id: string, width: number, height: number) =>
  `https://picsum.photos/seed/acceptance-${id}/${width}/${height}`;

const PHOTOS: MediaViewerItem[] = [
  {
    src: photo("gate", 1600, 1200),
    thumbnail: photo("gate", 200, 150),
    width: 1600,
    height: 1200,
    alt: "Разгрузка у ворот 3",
  },
  {
    src: photo("pallets", 1600, 1200),
    thumbnail: photo("pallets", 200, 150),
    width: 1600,
    height: 1200,
    alt: "Паллеты после приёмки",
  },
  {
    src: photo("label", 1200, 1600),
    thumbnail: photo("label", 150, 200),
    width: 1200,
    height: 1600,
    alt: "Маркировка коробки",
  },
  {
    src: photo("seal", 1600, 1200),
    thumbnail: photo("seal", 200, 150),
    width: 1600,
    height: 1200,
    alt: "Пломба на кузове",
  },
];

export default function MediaViewerOverviewExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <div className={styles.grid}>
        {PHOTOS.map((item, at) => (
          <Thumbnail.Root key={item.src} asChild ratio="4:3" fullWidth>
            <button
              type="button"
              aria-label={`Открыть фото: ${item.alt}`}
              onClick={() => {
                setIndex(at);
                setOpen(true);
              }}
            >
              <Thumbnail.Image src={item.thumbnail ?? item.src} />
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
      />
    </>
  );
}
