/** An album of photos of different shapes and a video, laid out by their ratios before anything loads; a tile opens the album in the viewer — `items`, `width`, `height`, `type`. */
import { Gallery, type GalleryItem } from "prime-ui-kit";

const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const ITEMS: GalleryItem[] = [
  {
    src: "https://picsum.photos/seed/rack-a/600/800",
    width: 600,
    height: 800,
    alt: "Стеллаж А",
  },
  {
    src: "https://picsum.photos/seed/dock/1200/800",
    width: 1200,
    height: 800,
    alt: "Рампа",
  },
  { type: "video", src: CLIP, width: 1280, height: 720, duration: 6, alt: "Проезд к рампе" },
];

export default function GalleryOverviewExample() {
  return <Gallery items={ITEMS} />;
}
