/** Photos of a delivery that open a viewer: the frame is put on a button, so it lifts on hover, presses and takes the focus ring — `asChild`. */
import { Icon, MediaViewer, type MediaViewerItem, Thumbnail } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const photoUrl = (id: string, width: number) =>
  `https://picsum.photos/seed/delivery-${id}/${width}/${Math.round((width * 3) / 4)}`;

const PHOTOS: MediaViewerItem[] = [
  { id: "dock", title: "Разгрузка у ворот 3" },
  { id: "pallets", title: "Паллеты после приёмки" },
  { id: "label", title: "Маркировка коробки" },
].map(({ id, title }) => ({
  src: photoUrl(id, 1600),
  thumbnail: photoUrl(id, 160),
  width: 1600,
  height: 1200,
  alt: title,
}));

export default function ThumbnailPressableExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <div className={styles.row}>
        {PHOTOS.map((photo, at) => (
          <Thumbnail.Root key={photo.src} asChild size="xl" ratio="4:3">
            <button
              type="button"
              aria-label={`Открыть фото: ${photo.alt}`}
              onClick={() => {
                setIndex(at);
                setOpen(true);
              }}
            >
              <Thumbnail.Image src={photo.thumbnail ?? photo.src} />
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
