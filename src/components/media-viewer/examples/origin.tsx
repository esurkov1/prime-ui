/** Every photo flies back into its own thumbnail, also after paging, and the last one leads to the first — `getOrigin`, `loop`. */
import { Icon, MediaViewer, type MediaViewerItem, Thumbnail } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const photo = (id: string, width: number, height: number) =>
  `https://picsum.photos/seed/fleet-${id}/${width}/${height}`;

const PHOTOS: MediaViewerItem[] = ["front", "side", "cargo", "cabin", "wheels", "plate"].map(
  (id, at) => ({
    src: photo(id, 1600, 1200),
    thumbnail: photo(id, 200, 150),
    width: 1600,
    height: 1200,
    alt: `Газель А 123 ВС, фото ${at + 1}`,
  }),
);

export default function MediaViewerOriginExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const tiles = React.useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <>
      <div className={styles.grid}>
        {PHOTOS.map((item, at) => (
          <Thumbnail.Root key={item.src} asChild ratio="1:1" fullWidth>
            <button
              ref={(node) => {
                tiles.current[at] = node;
              }}
              type="button"
              aria-label={`Открыть: ${item.alt}`}
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
        getOrigin={(at) => tiles.current[at] ?? null}
        loop
      />
    </>
  );
}
