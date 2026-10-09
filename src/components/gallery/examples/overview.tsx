/** One album of mixed photos and a video, re-laid out for every count from one to ten: the switcher picks how many items the gallery holds, the layout cross-fades into the next, and a tile opens the album in the viewer — `items`, `width`, `height`, `type`. */
import { Crossfade, Gallery, type GalleryItem, SegmentedControl } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const photo = (seed: string, width: number, height: number, alt: string): GalleryItem => ({
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
  alt,
});

const ITEMS: GalleryItem[] = [
  photo("rack-a", 600, 800, "Стеллаж А"),
  photo("dock", 1200, 800, "Рампа"),
  { type: "video", src: CLIP, width: 1280, height: 720, duration: 6, alt: "Проезд к рампе" },
  photo("pallet", 800, 800, "Паллета 1"),
  photo("yard", 1600, 900, "Двор склада"),
  photo("rack-b", 600, 900, "Стеллаж Б"),
  photo("gate", 800, 600, "Ворота 2"),
  photo("seal", 800, 800, "Пломба"),
  photo("rack-c", 600, 800, "Стеллаж В"),
  photo("bay", 1200, 800, "Зона погрузки"),
];

const COUNTS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function GalleryOverviewExample() {
  const [count, setCount] = React.useState("3");
  return (
    <div className={styles.stage}>
      <SegmentedControl.Root
        value={count}
        onValueChange={setCount}
        aria-label="Фото в альбоме"
        className={styles.fit}
      >
        {COUNTS.map((value) => (
          <SegmentedControl.Item key={value} value={value}>
            {value}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl.Root>
      <Crossfade state={count} className={styles.fit}>
        <Gallery items={ITEMS.slice(0, Number(count))} />
      </Crossfade>
    </div>
  );
}
