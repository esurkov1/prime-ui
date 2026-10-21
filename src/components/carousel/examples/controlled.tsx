/** The photo shown lives in the screen: the thumbnails under the carousel pick it, the caption follows every swipe, around the ends too — `index`, `onIndexChange`, `loop`. */
import { Carousel, type CarouselItem, Thumbnail, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const photo = (id: string, width: number, height: number) =>
  `https://picsum.photos/seed/delivery-${id}/${width}/${height}`;

const SHOTS = [
  { id: "door", alt: "Дверь получателя" },
  { id: "box", alt: "Коробка у двери" },
  { id: "label", alt: "Этикетка заказа № 4821" },
  { id: "seal", alt: "Пломба цела" },
  { id: "sign", alt: "Подпись получателя" },
];

const PHOTOS: CarouselItem[] = SHOTS.map((shot) => ({
  src: photo(shot.id, 960, 720),
  alt: shot.alt,
}));

export default function CarouselControlledExample() {
  const [index, setIndex] = React.useState(0);

  return (
    <div className={styles.frame}>
      <Carousel.Root
        items={PHOTOS}
        index={index}
        onIndexChange={setIndex}
        loop
        aria-label="Фото доставки"
      />
      <div className={styles.strip}>
        {SHOTS.map((shot, at) => (
          <Thumbnail.Root key={shot.id} asChild ratio="4:3" fullWidth>
            <button
              type="button"
              aria-label={shot.alt}
              aria-current={at === index ? true : undefined}
              onClick={() => setIndex(at)}
            >
              <Thumbnail.Image src={photo(shot.id, 160, 120)} />
            </button>
          </Thumbnail.Root>
        ))}
      </div>
      <Typography as="p" variant="body-s" tone="muted">
        {SHOTS[index]?.alt}
      </Typography>
    </div>
  );
}
