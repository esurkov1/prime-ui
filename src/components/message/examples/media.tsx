/** A photo with a caption, an album with a video laid out as tiles, an outgoing album with neutral gaps and a photo still uploading with its ring and cancel; a tile opens your viewer — `Message.Media`, `items`, `onItemOpen`, `onCancel`. */
import { Message, type MessageMediaItem } from "prime-ui-kit";
import * as React from "react";

const photo = (seed: string, width: number, height: number, alt: string): MessageMediaItem => ({
  src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
  width,
  height,
  alt,
});

const GATE = [photo("warehouse-gate", 800, 600, "Ворота склада после ремонта")];

const ALBUM: MessageMediaItem[] = [
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

const REPORT = [
  photo("pallet-a", 800, 600, "Паллета 1"),
  photo("pallet-b", 800, 600, "Паллета 2"),
  photo("pallet-c", 600, 800, "Паллета 3"),
];

export default function MessageMediaExample() {
  const [opened, setOpened] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(true);

  return (
    <Message.Group aria-label="Чат склада">
      <Message.Root direction="incoming" time="09:12">
        <Message.Media items={GATE} onItemOpen={(index) => setOpened(GATE[index]?.alt ?? null)} />
        <Message.Text>Ворота отремонтировали, можно принимать фуры.</Message.Text>
      </Message.Root>
      <Message.Root direction="incoming" time="09:15">
        <Message.Media items={ALBUM} onItemOpen={(index) => setOpened(ALBUM[index]?.alt ?? null)} />
      </Message.Root>
      <Message.Root direction="outgoing" time="09:18" status="read">
        <Message.Media
          items={REPORT}
          onItemOpen={(index) => setOpened(REPORT[index]?.alt ?? null)}
        />
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
      {opened ? <Message.Service>Открыто: {opened}</Message.Service> : null}
    </Message.Group>
  );
}
