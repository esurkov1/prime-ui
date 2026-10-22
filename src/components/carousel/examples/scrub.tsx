/** A catalogue of scooters: moving the mouse across a card's cover runs through its photos, leaving the card shows the first again — `scrub`. */
import { Card, Carousel, type CarouselItem } from "prime-ui-kit";

import styles from "./examples.module.css";

const photos = (model: string, alt: string): CarouselItem[] =>
  ["front", "side", "rear", "dash"].map((shot, at) => ({
    src: `https://picsum.photos/seed/catalogue-${model}-${shot}/720/540`,
    alt: `${alt}, фото ${at + 1}`,
  }));

const SCOOTERS = [
  {
    id: "adv",
    title: "Honda ADV 350",
    price: "2 400 ₽ / сутки",
    items: photos("adv", "Honda ADV 350"),
  },
  {
    id: "nmax",
    title: "Yamaha NMAX 155",
    price: "1 800 ₽ / сутки",
    items: photos("nmax", "Yamaha NMAX 155"),
  },
  {
    id: "vespa",
    title: "Vespa Primavera",
    price: "2 100 ₽ / сутки",
    items: photos("vespa", "Vespa Primavera"),
  },
];

export default function CarouselScrubExample() {
  return (
    <div className={styles.catalogue}>
      {SCOOTERS.map((scooter) => (
        <Card.Root key={scooter.id}>
          <Card.Media>
            <Carousel.Root items={scooter.items} scrub aria-label={`Фото ${scooter.title}`} />
          </Card.Media>
          <Card.Header>
            <Card.Title>{scooter.title}</Card.Title>
            <Card.Description>{scooter.price}</Card.Description>
          </Card.Header>
        </Card.Root>
      ))}
    </div>
  );
}
