/** Photos of a delivery that open a viewer: the frame is put on a button, so it lifts on hover, presses and takes the focus ring — `asChild`. */
import { Icon, Modal, Thumbnail } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const PHOTOS = [
  { id: "dock", title: "Разгрузка у ворот 3" },
  { id: "pallets", title: "Паллеты после приёмки" },
  { id: "label", title: "Маркировка коробки" },
];

const photoUrl = (id: string, width: number) =>
  `https://picsum.photos/seed/delivery-${id}/${width}/${Math.round((width * 3) / 4)}`;

export default function ThumbnailPressableExample() {
  const [opened, setOpened] = React.useState<(typeof PHOTOS)[number] | null>(null);

  return (
    <>
      <div className={styles.row}>
        {PHOTOS.map((photo) => (
          <Thumbnail.Root key={photo.id} asChild size="xl" ratio="4:3">
            <button
              type="button"
              aria-label={`Открыть фото: ${photo.title}`}
              onClick={() => setOpened(photo)}
            >
              <Thumbnail.Image src={photoUrl(photo.id, 160)} />
              <Thumbnail.Fallback>
                <Icon name="object.image" />
              </Thumbnail.Fallback>
            </button>
          </Thumbnail.Root>
        ))}
      </div>
      <Modal.Root open={opened !== null} onOpenChange={(open) => !open && setOpened(null)}>
        <Modal.Content size="l">
          <Modal.Header>
            <Modal.Title>{opened?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {opened ? (
              <Thumbnail.Root fullWidth ratio="4:3">
                <Thumbnail.Image src={photoUrl(opened.id, 960)} alt={opened.title} />
                <Thumbnail.Fallback>
                  <Icon name="object.image" />
                </Thumbnail.Fallback>
              </Thumbnail.Root>
            ) : null}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
