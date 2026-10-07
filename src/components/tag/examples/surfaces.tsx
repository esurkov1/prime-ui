/** Plain, removable and disabled tags that stay distinguishable on canvas, card and floating layers. Use as-is on any surface. */
import { Tag } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function TagSurfacesExample() {
  return (
    <div className={styles.tags}>
      <Tag.Root>Дизайн</Tag.Root>
      <Tag.Root labels={{ remove: "Убрать «Маркетинг»" }} onRemove={() => undefined}>
        Маркетинг
      </Tag.Root>
      <Tag.Root disabled>Архив</Tag.Root>
    </div>
  );
}
