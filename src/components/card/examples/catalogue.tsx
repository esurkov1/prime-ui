/** A fleet catalogue: each unit's photos are the cover, its status and plate stand on them, the model and the place sit under them, the other badges wrap, and the term with its bar keeps to the bottom of the card, which opens the unit as a whole, at the dense tier — `Card.Media`, `size`, `Card.Header`, `Card.Link`, `Card.Footer`. */
import { Badge, Card, Carousel, type CarouselItem, ProgressBar, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Unit = {
  id: string;
  model: string;
  year: number;
  details: string;
  plate: string;
  status: { label: string; tone: "info" | "success" | "warning" | "danger" };
  badges: { label: string; tone: "danger" | "warning" | "neutral" }[];
  term: { text: string; progress: number; overdue?: boolean };
  photos: string[];
};

const photo = (id: string) => `https://picsum.photos/seed/unit-${id}/960/640`;

const UNITS: Unit[] = [
  {
    id: "pcx-5678",
    model: "Honda PCX 160",
    year: 2024,
    details: "Серый матовый · Waikl",
    plate: "ภก 5678",
    status: { label: "В аренде", tone: "info" },
    badges: [
      { label: "Не зарегистрирован", tone: "danger" },
      { label: "Страховка истекла", tone: "danger" },
      { label: "ТО через 120 км", tone: "warning" },
      { label: "Депозит 300 $", tone: "neutral" },
    ],
    term: { text: "с 21 окт · 8 дн. · до 29 окт", progress: 12 },
    photos: ["pcx-front", "pcx-side", "pcx-seat"],
  },
  {
    id: "nmax-1204",
    model: "Yamaha NMAX 155",
    year: 2023,
    details: "Белый · Патонг",
    plate: "ขค 1204",
    status: { label: "Свободен", tone: "success" },
    badges: [],
    term: { text: "Простой 2 дн.", progress: 28 },
    photos: ["nmax-front", "nmax-side"],
  },
  {
    id: "adv-3310",
    model: "Honda ADV 160",
    year: 2024,
    details: "Чёрный · Ката",
    plate: "งจ 3310",
    status: { label: "В сервисе", tone: "warning" },
    badges: [{ label: "Ждёт ремень вариатора", tone: "warning" }],
    term: { text: "с 19 окт · 2 дн. · до 23 окт", progress: 50 },
    photos: ["adv-front", "adv-side", "adv-dash"],
  },
  {
    id: "click-0917",
    model: "Honda Click 160",
    year: 2023,
    details: "Красный · Раваи",
    plate: "ฉช 0917",
    status: { label: "Возврат просрочен", tone: "danger" },
    badges: [{ label: "Депозит 150 $", tone: "neutral" }],
    term: { text: "+2 дн. · был до 19 окт", progress: 100, overdue: true },
    photos: ["click-front", "click-side"],
  },
];

const mediaOf = (unit: Unit): CarouselItem[] =>
  unit.photos.map((id, index) => ({ src: photo(id), alt: `${unit.model}, фото ${index + 1}` }));

const hrefOf = (unit: Unit) => `#unit-${unit.id}`;

export default function CardCatalogueExample() {
  return (
    <div className={styles.catalogue}>
      {UNITS.map((unit) => (
        <Card.Root key={unit.id} size="s">
          <Card.Media>
            <Carousel.Root
              items={mediaOf(unit)}
              ratio="16:10"
              scrub
              // A press on the photos opens the unit, as the rest of the card does.
              onItemOpen={() => window.location.assign(hrefOf(unit))}
              aria-label={`Фото ${unit.model}`}
            >
              <Carousel.Overlay placement="top-start">
                <Badge.Root variant="solid" tone={unit.status.tone}>
                  {unit.status.label}
                </Badge.Root>
              </Carousel.Overlay>
              <Carousel.Overlay placement="bottom-start">
                <Badge.Root variant="solid">{unit.plate}</Badge.Root>
              </Carousel.Overlay>
            </Carousel.Root>
          </Card.Media>
          <Card.Header>
            <Card.Title>
              <Card.Link href={hrefOf(unit)}>
                {unit.model}
                <Typography as="span" variant="title-s" tone="secondary">
                  {` · ${unit.year}`}
                </Typography>
              </Card.Link>
            </Card.Title>
            <Card.Description>
              <Typography as="span" variant="body-s" tone="secondary" truncate>
                {unit.details}
              </Typography>
            </Card.Description>
          </Card.Header>
          {unit.badges.length > 0 ? (
            <Card.Body>
              <Badge.Group>
                {unit.badges.map((badge) => (
                  <Badge.Root key={badge.label} tone={badge.tone}>
                    {badge.label}
                  </Badge.Root>
                ))}
              </Badge.Group>
            </Card.Body>
          ) : null}
          <Card.Footer>
            <Typography
              as="span"
              variant="body-s"
              tone={unit.term.overdue ? "danger" : "muted"}
              numeric="tabular"
            >
              {unit.term.text}
            </Typography>
            <ProgressBar
              size="xs"
              value={unit.term.progress}
              tone={unit.status.tone}
              aria-label={`Срок: ${unit.term.text}`}
            />
          </Card.Footer>
        </Card.Root>
      ))}
    </div>
  );
}
