/** Five photos of a scooter in one 4 : 3 box: swipe, the arrows on hover or a dot — `items`, `ratio`, `arrows`. */
import { Carousel, type CarouselItem } from "prime-ui-kit";

import styles from "./examples.module.css";

const photo = (id: string) => `https://picsum.photos/seed/scooter-${id}/960/720`;

const PHOTOS: CarouselItem[] = [
  { src: photo("front"), alt: "Honda ADV 350, вид спереди" },
  { src: photo("side"), alt: "Honda ADV 350, вид сбоку" },
  { src: photo("rear"), alt: "Honda ADV 350, вид сзади" },
  { src: photo("dash"), alt: "Приборная панель" },
  { src: photo("trunk"), alt: "Багажник под сиденьем" },
];

export default function CarouselOverviewExample() {
  return (
    <div className={styles.frame}>
      <Carousel.Root items={PHOTOS} ratio="4:3" arrows aria-label="Фото Honda ADV 350" />
    </div>
  );
}
