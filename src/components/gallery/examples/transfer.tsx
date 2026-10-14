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
  { ...photo("waybill", "Накладная"), transfer: "loading", transferProgress: 0.25 },
  { ...photo("damage", "Повреждённая коробка"), transfer: "failed" },
  { ...photo("seal", "Пломба"), transfer: "remote", transferDirection: "download" },
];

/** A stand-in transfer moves a quarter per step. */
const STEP_MS = 800;
const STEP = 0.25;

/** One step of every item in flight; a full one is done. */
const advance = (item: GalleryItem): GalleryItem => {
  if (item.transfer !== "loading") return item;
  const share = Math.min(1, (item.transferProgress ?? 0) + STEP);
  return { ...item, transferProgress: share, transfer: share >= 1 ? "done" : "loading" };
};

export default function GalleryTransferExample() {
  const [items, setItems] = React.useState(START);
  const inFlight = items.some((item) => item.transfer === "loading");

  // One clock for every transfer: a cancel takes its item out of `loading`, and the step skips it.
  React.useEffect(() => {
    if (!inFlight) return;
    const timer = window.setInterval(() => setItems((current) => current.map(advance)), STEP_MS);
    return () => window.clearInterval(timer);
  }, [inFlight]);

  const patch = (index: number, next: Partial<GalleryItem>) =>
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...next } : item)));

  const start = (index: number, direction: "upload" | "download") =>
    patch(index, { transfer: "loading", transferProgress: 0, transferDirection: direction });

  return (
    <Gallery
      items={items}
      onCancel={(index) => patch(index, { transfer: "failed" })}
      onRetry={(index) => start(index, "upload")}
      onDownload={(index) => start(index, "download")}
    />
  );
}
