/** A media library picks photos for a listing: each tile is a checkbox with its check in the corner, the selection lives in the parent and a button clears it — `checked`, `onCheckedChange`. */
import { Button, Icon, Thumbnail, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const LIBRARY = [
  { id: "hall", title: "Холл" },
  { id: "office", title: "Офис" },
  { id: "kitchen", title: "Кухня" },
  { id: "meeting", title: "Переговорная" },
  { id: "terrace", title: "Терраса" },
  { id: "parking", title: "Парковка" },
];

export default function ThumbnailControlledExample() {
  const [selected, setSelected] = React.useState<ReadonlySet<string>>(new Set(["hall"]));

  const toggle = (id: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <div className={styles.library}>
      <div className={styles.libraryBar}>
        <Typography as="span" variant="body-s" tone="muted" aria-live="polite">
          {selected.size === 0 ? "Ничего не выбрано" : `Выбрано: ${selected.size}`}
        </Typography>
        <Button.Root
          variant="ghost"
          tone="neutral"
          disabled={selected.size === 0}
          onClick={() => setSelected(new Set())}
        >
          Снять выбор
        </Button.Root>
      </div>
      <div className={styles.libraryGrid}>
        {LIBRARY.map((photo) => (
          <Thumbnail.Root
            key={photo.id}
            fullWidth
            ratio="4:3"
            aria-label={photo.title}
            checked={selected.has(photo.id)}
            onCheckedChange={(checked) => toggle(photo.id, checked)}
          >
            <Thumbnail.Image src={`https://picsum.photos/seed/office-${photo.id}/240/180`} />
            <Thumbnail.Fallback>
              <Icon name="object.image" />
            </Thumbnail.Fallback>
          </Thumbnail.Root>
        ))}
      </div>
    </div>
  );
}
