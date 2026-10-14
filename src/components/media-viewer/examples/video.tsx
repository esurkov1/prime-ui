/** A video among the photos of a site visit starts by default once its page settles; its bar has play, time, seek, the sound button and its level, and it has no zoom — `type`. */
import { Icon, MediaViewer, type MediaViewerItem, Thumbnail } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const photo = (id: string) => `https://picsum.photos/seed/site-${id}/1600/1200`;

const ITEMS: MediaViewerItem[] = [
  { src: photo("entrance"), width: 1600, height: 1200, alt: "Въезд на площадку" },
  { type: "video", src: CLIP, width: 1280, height: 720, alt: "Обход зоны погрузки" },
  { src: photo("ramp"), width: 1600, height: 1200, alt: "Рампа после ремонта" },
];

export default function MediaViewerVideoExample() {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  return (
    <>
      <div className={styles.grid}>
        {ITEMS.map((item, at) => (
          <Thumbnail.Root key={item.src} asChild ratio="4:3" fullWidth>
            <button
              type="button"
              aria-label={`Открыть: ${item.alt}`}
              onClick={() => {
                setIndex(at);
                setOpen(true);
              }}
            >
              {item.type === "video" ? (
                <Thumbnail.Video src={item.src} />
              ) : (
                <Thumbnail.Image src={item.src} />
              )}
              <Thumbnail.Fallback>
                <Icon name={item.type === "video" ? "action.video" : "object.image"} />
              </Thumbnail.Fallback>
            </button>
          </Thumbnail.Root>
        ))}
      </div>
      <MediaViewer
        items={ITEMS}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </>
  );
}
