/** Captions under a photo, a tall portrait, an album and a video, each as wide as its media; an album with a video laid out as tiles, an outgoing album with neutral gaps and a photo still uploading with its ring and cancel; a tile opens the album in the viewer — `Message.Media`, `items`, `onCancel`. */
import { type GalleryItem, Message } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const photo = (seed: string, width: number, height: number, alt: string): GalleryItem => ({
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
  alt,
});

const GATE = [photo("warehouse-gate", 800, 600, "Ворота склада после ремонта")];

const ALBUM: GalleryItem[] = [
  photo("shelf-a", 600, 800, "Стеллаж А"),
  photo("shelf-b", 800, 600, "Стеллаж Б"),
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    width: 1280,
    height: 720,
    duration: 6,
    alt: "Проезд к рампе",
  },
  photo("loading-bay", 800, 500, "Зона погрузки"),
  photo("office-desk", 600, 600, "Рабочее место кладовщика"),
];

const SEAL = [photo("seal-portrait", 600, 1000, "Пломба на воротах")];

const CLIP: GalleryItem[] = [
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    width: 1280,
    height: 720,
    duration: 6,
    alt: "Обход рампы",
  },
];

const REPORT = [
  photo("pallet-a", 800, 600, "Паллета 1"),
  photo("pallet-b", 800, 600, "Паллета 2"),
  photo("pallet-c", 600, 800, "Паллета 3"),
];

export default function MessageMediaExample() {
  const [uploading, setUploading] = React.useState(true);

  return (
    <div className={styles.thread}>
      <Message.Root direction="incoming" time="09:12">
        <Message.Media items={GATE} />
        <Message.Text>Ворота отремонтировали, можно принимать фуры.</Message.Text>
      </Message.Root>
      <Message.Root direction="incoming" time="09:15">
        <Message.Media items={ALBUM} />
      </Message.Root>
      <Message.Root direction="outgoing" time="09:16" status="read">
        <Message.Media items={SEAL} />
        <Message.Text>Пломба цела.</Message.Text>
      </Message.Root>
      <Message.Root direction="incoming" time="09:17">
        <Message.Media items={CLIP} />
        <Message.Text>
          Обход рампы перед приёмкой: третья секция стеллажей свободна, паллеты можно ставить сразу
          после разгрузки, накладные я уже подписала и отправила в бухгалтерию.
        </Message.Text>
      </Message.Root>
      <Message.Root direction="outgoing" time="09:18" status="read">
        <Message.Media items={REPORT} />
        <Message.Text>Фотоотчёт по паллетам для «ТехноСнаб».</Message.Text>
      </Message.Root>
      {uploading ? (
        <Message.Root direction="outgoing" time="09:20" status="sending">
          <Message.Media
            items={[
              {
                ...photo("invoice-scan", 600, 800, "Скан накладной"),
                transfer: "loading",
                transferProgress: 0.42,
              },
            ]}
            onCancel={() => setUploading(false)}
          />
        </Message.Root>
      ) : null}
    </div>
  );
}
