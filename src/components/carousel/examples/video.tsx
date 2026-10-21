/** A bike with a short looping clip first, muted and playing while it is in view, and a walkaround video among the photos — `type`, `autoPlay`, `loop`, `poster`. */
import { Carousel, type CarouselItem } from "prime-ui-kit";

import styles from "./examples.module.css";

const CLIP = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
const photo = (id: string) => `https://picsum.photos/seed/ebike-${id}/960/720`;

const MEDIA: CarouselItem[] = [
  { type: "video", src: CLIP, autoPlay: true, loop: true, alt: "Электровелосипед в движении" },
  { src: photo("side"), alt: "Электровелосипед, сбоку" },
  { src: photo("battery"), alt: "Батарея 48 В" },
  {
    type: "video",
    src: CLIP,
    poster: photo("walkaround"),
    alt: "Обзор электровелосипеда",
  },
  { src: photo("display"), alt: "Дисплей на руле" },
];

export default function CarouselVideoExample() {
  return (
    <div className={styles.frame}>
      <Carousel.Root items={MEDIA} aria-label="Фото и видео электровелосипеда" />
    </div>
  );
}
