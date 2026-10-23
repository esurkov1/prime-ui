/** A cover is the kit's carousel: on top with the owner's avatar on its edge, a column at the start, and a cover that is still loading — `Card.Media`, `placement`, `ratio`, `dots`, `loading`. */
import {
  Avatar,
  Badge,
  Card,
  Carousel,
  type CarouselItem,
  DescriptionList,
  StatusDot,
} from "prime-ui-kit";

import styles from "./examples.module.css";

const photo = (id: string) => `https://picsum.photos/seed/cover-${id}/960/720`;

const NMAX: CarouselItem[] = [
  { src: photo("nmax-front"), alt: "Yamaha NMAX 155, спереди" },
  { src: photo("nmax-side"), alt: "Yamaha NMAX 155, сбоку" },
  { src: photo("nmax-dash"), alt: "Приборная панель" },
];

const ADV: CarouselItem[] = [{ src: photo("adv"), alt: "Honda ADV 350" }];

export default function CardCoverExample() {
  return (
    <div className={styles.grid}>
      <Card.Root>
        <Card.Media>
          <Carousel.Root items={NMAX} ratio="4:3" dots aria-label="Фото Yamaha NMAX 155" />
        </Card.Media>
        <Card.Header>
          <Card.Icon>
            <Avatar.Root color="purple">
              <Avatar.Fallback>АК</Avatar.Fallback>
            </Avatar.Root>
          </Card.Icon>
          <Card.Title>Yamaha NMAX 155</Card.Title>
          <Card.Badges>
            <Badge.Root tone="success">На линии</Badge.Root>
          </Card.Badges>
          <Card.Description>А 123 ВС 777 · 3 200 км</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root>
        <Card.Media>
          <Carousel.Root items={[]} loading ratio="4:3" aria-label="Фото скутера" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Vespa Primavera</Card.Title>
          <Card.Description>В 456 КМ 777 · 1 200 км</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root className={styles.wide}>
        <Card.Media placement="start">
          <Carousel.Root items={ADV} ratio="4:3" aria-label="Фото Honda ADV 350" />
        </Card.Media>
        <Card.Header>
          <Card.Title>Honda ADV 350</Card.Title>
          <Card.Description>
            <StatusDot tone="warning">В ремонте</StatusDot>до 14 окт.
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Пробег">8 400 км</DescriptionList.Item>
            <DescriptionList.Item label="Сервис">Мотоцентр «Север»</DescriptionList.Item>
          </DescriptionList.Root>
        </Card.Body>
      </Card.Root>
    </div>
  );
}
