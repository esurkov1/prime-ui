/** Product photos in a wrapping grid: a photo carried across rows lands in reading order, the gap takes a cell, Alt + ← / → steps it one place — `axis`. */
import { Dnd, Icon, moveBefore, Thumbnail } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Photo = { id: string; title: string };

const PHOTOS: Photo[] = [
  { id: "chair-front", title: "Кресло спереди" },
  { id: "chair-side", title: "Кресло сбоку" },
  { id: "chair-back", title: "Кресло сзади" },
  { id: "chair-detail", title: "Подлокотник" },
  { id: "chair-base", title: "Крестовина" },
  { id: "chair-box", title: "Упаковка" },
  { id: "chair-room", title: "В интерьере" },
];

export default function DndGridExample() {
  const [photos, setPhotos] = React.useState(PHOTOS);

  return (
    <Dnd.Root>
      <Dnd.Sortable
        as="ul"
        axis="grid"
        aria-label="Фото товара по порядку"
        className={styles.gallery}
        items={photos}
        getId={(photo) => photo.id}
        getLabel={(photo) => photo.title}
        onReorder={(id, beforeId) =>
          setPhotos((current) => moveBefore(current, id, beforeId, (photo) => photo.id))
        }
        renderItem={(photo) => (
          <Dnd.SortableItem id={photo.id} className={styles.tile} aria-label={photo.title}>
            <Thumbnail.Root fullWidth ratio="1:1">
              <Thumbnail.Image src={`https://picsum.photos/seed/${photo.id}/320/320`} />
              <Thumbnail.Fallback>
                <Icon name="object.image" />
              </Thumbnail.Fallback>
            </Thumbnail.Root>
          </Dnd.SortableItem>
        )}
      />
    </Dnd.Root>
  );
}
