/** A warehouse inspection of 120 photos with a filmstrip and captions: only the thumbnails in view are mounted — `thumbnails`, `caption`. */
import { Button, Icon, MediaViewer, type MediaViewerItem } from "prime-ui-kit";
import * as React from "react";

const SPOTS = [
  ["racks", "Стеллажи ряда A", "Ряд A: нагрузка в норме, маркировка читается."],
  ["aisle", "Проход между рядами B и C", "Проход свободен, разметка обновлена в сентябре."],
  ["dock", "Рампа 2", "Отбойник рампы треснул — заявка на замену № 418."],
  ["fire", "Пожарный щит", "Огнетушители проверены, следующая проверка в марте."],
  ["light", "Освещение зоны отгрузки", "Две лампы не горят, заявка № 421."],
  ["floor", "Покрытие пола у ворот 4", "Скол покрытия 30 × 40 см, нужен ремонт."],
  ["cold", "Холодильная камера", "Температура +3 °C, журнал заполнен."],
  ["boxes", "Зона возвратов", "14 коробок ждут разбора с прошлой недели."],
  ["office", "Пост кладовщика", "Сканеры заряжены, принтер этикеток работает."],
  ["yard", "Площадка перед складом", "Разметка парковки стёрлась у въезда."],
] as const;

const photo = (id: string, width: number, height: number) =>
  `https://picsum.photos/seed/inspection-${id}/${width}/${height}`;

/** Twelve rounds of the ten spots: 120 photos of one inspection. */
const PHOTOS: MediaViewerItem[] = Array.from({ length: 120 }, (_, at) => {
  const [id, alt, caption] = SPOTS[at % SPOTS.length] as (typeof SPOTS)[number];
  const round = Math.floor(at / SPOTS.length) + 1;
  return {
    src: photo(`${id}-${round}`, 1600, 1067),
    thumbnail: photo(`${id}-${round}`, 150, 100),
    width: 1600,
    height: 1067,
    alt: `${alt}, обход ${round}`,
    caption,
  };
});

export default function MediaViewerThumbnailsExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button.Root variant="soft" tone="neutral" onClick={() => setOpen(true)}>
        <Button.Icon>
          <Icon name="object.image" />
        </Button.Icon>
        Фотоотчёт осмотра · 120 фото
      </Button.Root>
      <MediaViewer items={PHOTOS} open={open} onOpenChange={setOpen} thumbnails />
    </>
  );
}
