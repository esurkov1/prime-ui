/** Buttons over a listing's cover: round actions on the media shade, a labelled one on glass; a failed upload turns its disk danger — `variant`, `shape`, `tone`. */
import { Button, Icon, Thumbnail } from "prime-ui-kit";

import styles from "./examples.module.css";

const COVER = "https://picsum.photos/seed/loft-hall/480/320";

export default function ButtonOverMediaExample() {
  return (
    <div className={styles.cover}>
      <Thumbnail.Root ratio="3:2" fullWidth>
        <Thumbnail.Image src={COVER} />
        <Thumbnail.Fallback>
          <Icon name="object.image" />
        </Thumbnail.Fallback>
      </Thumbnail.Root>
      <div className={styles.coverActions}>
        <Button.Root shape="circle" variant="shade" aria-label="Заменить обложку">
          <Button.Icon>
            <Icon name="action.edit" />
          </Button.Icon>
        </Button.Root>
        <Button.Root
          shape="circle"
          variant="shade"
          tone="danger"
          aria-label="Повторить загрузку обложки"
        >
          <Button.Icon>
            <Icon name="action.refresh" />
          </Button.Icon>
        </Button.Root>
      </div>
      <Button.Root variant="glass" tone="neutral" className={styles.coverGallery}>
        <Button.Icon>
          <Icon name="object.image" />
        </Button.Icon>
        Все 12 фото
      </Button.Root>
    </div>
  );
}
