/** The record still loading, a single photo (no dots), a photo that failed, no photos at all and the dots left out — `loading`, `items`, `dots`. */
import { Carousel, type CarouselItem, Typography } from "prime-ui-kit";

const ONE: CarouselItem[] = [
  { src: "https://picsum.photos/seed/scooter-front/960/720", alt: "Yamaha NMAX 155" },
];

const BROKEN: CarouselItem[] = [
  { src: "/missing-scooter-photo.jpg", alt: "Vespa Primavera" },
  { src: "https://picsum.photos/seed/scooter-side/960/720", alt: "Vespa Primavera, сбоку" },
];

export default function CarouselStatesExample() {
  return (
    <div>
      <div>
        <Carousel.Root items={[]} loading aria-label="Фото скутера" />
        <Typography as="span" variant="caption" tone="muted">
          loading
        </Typography>
      </div>
      <div>
        <Carousel.Root items={ONE} aria-label="Фото Yamaha NMAX 155" />
        <Typography as="span" variant="caption" tone="muted">
          one item
        </Typography>
      </div>
      <div>
        <Carousel.Root items={BROKEN} aria-label="Фото Vespa Primavera" />
        <Typography as="span" variant="caption" tone="muted">
          error
        </Typography>
      </div>
      <div>
        <Carousel.Root items={BROKEN.slice(1).concat(ONE)} dots={false} aria-label="Фото Vespa" />
        <Typography as="span" variant="caption" tone="muted">
          no dots
        </Typography>
      </div>
      <div>
        <Carousel.Root items={[]} aria-label="Фото Honda Dio" />
        <Typography as="span" variant="caption" tone="muted">
          empty
        </Typography>
      </div>
    </div>
  );
}
