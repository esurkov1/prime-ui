/** Items on their way, one look both ways: an upload with its ring and cancel, a failed one with a retry, a received one waiting to be fetched — the picture dims under the disk until it is done — `transfer`, `transferProgress`, `transferDirection`, `onCancel`, `onRetry`, `onDownload`. */
import { Gallery, type GalleryItem } from "prime-ui-kit";
import * as React from "react";

const photo = (seed: string, alt: string): GalleryItem => ({
  src: `https://picsum.photos/seed/${seed}/800/600`,
  width: 800,
  height: 600,
  alt,
});

const START: GalleryItem[] = [
  { ...photo("waybill", "Накладная"), transfer: "loading", transferProgress: 0.35 },
  { ...photo("damage", "Повреждённая коробка"), transfer: "failed" },
  { ...photo("seal", "Пломба"), transfer: "remote", transferDirection: "download" },
];

const STEP_MS = 400;

export default function GalleryTransferExample() {
  const [items, setItems] = React.useState(START);

  const patch = (index: number, next: Partial<GalleryItem>) =>
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...next } : item)));

  /** A stand-in transfer: four steps, then done. */
  const run = (index: number, direction: "upload" | "download") => {
    let share = 0;
    patch(index, { transfer: "loading", transferProgress: 0, transferDirection: direction });
    const timer = window.setInterval(() => {
      share = Math.min(1, share + 0.25);
      patch(index, { transferProgress: share, ...(share >= 1 ? { transfer: "done" } : {}) });
      if (share >= 1) window.clearInterval(timer);
    }, STEP_MS);
  };

  return (
    <Gallery
      items={items}
      onCancel={(index) => patch(index, { transfer: "failed" })}
      onRetry={(index) => run(index, "upload")}
      onDownload={(index) => run(index, "download")}
    />
  );
}
