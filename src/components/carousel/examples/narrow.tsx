/** A listing card in a phone-wide column: the box follows the column, the dots and the photo count stay clear of each other while the price stands in the footer — `ratio`, `Carousel.Overlay`. */
import { Badge, Card, Carousel, type CarouselItem } from "prime-ui-kit";

import styles from "./examples.module.css";

const photo = (id: string) => `https://picsum.photos/seed/rental-${id}/720/720`;

const PHOTOS: CarouselItem[] = [
  { src: photo("front"), alt: "Yamaha NMAX, спереди" },
  { src: photo("side"), alt: "Yamaha NMAX, сбоку" },
  { src: photo("helmet"), alt: "Шлем в комплекте" },
];

export default function CarouselNarrowExample() {
  return (
    <div className={styles.narrow}>
      <Card.Root>
        <Card.Media>
          <Carousel.Root items={PHOTOS} ratio="1:1" aria-label="Фото Yamaha NMAX">
            <Carousel.Overlay placement="top-end">
              <Badge.Root variant="solid">{`${PHOTOS.length} фото`}</Badge.Root>
            </Carousel.Overlay>
          </Carousel.Root>
        </Card.Media>
        <Card.Header>
          <Card.Title>Yamaha NMAX 155</Card.Title>
          <Card.Description>Свободен с 24 октября</Card.Description>
        </Card.Header>
        <Card.Footer>
          <Card.Total label="За сутки">1 200 ₽</Card.Total>
        </Card.Footer>
      </Card.Root>
    </div>
  );
}
