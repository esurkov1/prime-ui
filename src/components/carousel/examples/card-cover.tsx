/** A vehicle card with the photos as its cover: only the photo's own things stand on it — the count of photos, a photo's note and a video's length travelling with their slide — while the status goes to the header, and a press opens the photo full-screen — `Carousel.Overlay`, `placement`, `renderOverlay`, `onItemOpen`. */
import { Badge, Card, Carousel, type CarouselItem, MediaViewer } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const photo = (id: string, width: number, height: number) =>
  `https://picsum.photos/seed/fleet-${id}/${width}/${height}`;

const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const MEDIA: CarouselItem[] = [
  { src: photo("front", 960, 720), alt: "Kia Rio, спереди" },
  { src: photo("wing", 960, 720), alt: "Kia Rio, левое крыло" },
  { type: "video", src: CLIP, poster: photo("walk", 960, 720), alt: "Kia Rio, обход машины" },
  { src: photo("cabin", 960, 720), alt: "Kia Rio, салон" },
];

/** The notes of a photo itself, taken at the handover. */
const NOTES: Record<string, string> = { [MEDIA[1]?.src ?? ""]: "Царапина на крыле" };

const VIEWER = MEDIA.map((item) => ({
  type: item.type,
  src: item.type === "video" ? item.src : item.src.replace("960/720", "1920/1440"),
  thumbnail: item.poster ?? item.src,
  poster: item.poster,
  alt: item.alt,
  width: 1920,
  height: 1440,
}));

export default function CarouselCardCoverExample() {
  const [index, setIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  return (
    <div className={styles.card}>
      <Card.Root>
        <Card.Media>
          <Carousel.Root
            items={MEDIA}
            index={index}
            onIndexChange={setIndex}
            onItemOpen={() => setOpen(true)}
            renderOverlay={(item) =>
              NOTES[item.src] ? (
                <Carousel.Overlay placement="top-start">
                  <Badge.Root tone="warning" variant="solid">
                    {NOTES[item.src]}
                  </Badge.Root>
                </Carousel.Overlay>
              ) : null
            }
            aria-label="Фото Kia Rio"
          >
            <Carousel.Overlay placement="top-end">
              <Badge.Root variant="solid">{`${index + 1} / ${MEDIA.length}`}</Badge.Root>
            </Carousel.Overlay>
          </Carousel.Root>
        </Card.Media>
        <Card.Header>
          <Card.Title>Kia Rio, 2022</Card.Title>
          <Card.Badges>
            <Badge.Root tone="success">На линии</Badge.Root>
          </Card.Badges>
          <Card.Description>Пробег 48 200 км · водитель Иван Петров</Card.Description>
        </Card.Header>
      </Card.Root>
      <MediaViewer
        items={VIEWER}
        open={open}
        onOpenChange={setOpen}
        index={index}
        onIndexChange={setIndex}
      />
    </div>
  );
}
