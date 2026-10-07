/** Sizes xs–xl change padding, icon and text of the card; pass `size` to `notify()` or to a static record. Use smaller sizes for dense apps, larger ones for touch screens. */
import { type ControlSize, NotificationCard, type NotificationRecord } from "prime-ui-kit";

import styles from "./examples.module.css";

const sizes: ControlSize[] = ["xs", "s", "m", "l", "xl"];

const card = (size: ControlSize): NotificationRecord => ({
  id: `sizes-${size}`,
  tone: "info",
  title: `Размер ${size}`,
  description: "Меняются отступы, иконка и текст карточки.",
  position: "top-right",
  size,
  duration: 0,
  persistent: true,
  closable: true,
  createdAt: 0,
});

export default function NotificationSizesExample() {
  return (
    <div className={styles.cards}>
      {sizes.map((size) => (
        <NotificationCard key={size} item={card(size)} paused onDismiss={() => {}} />
      ))}
    </div>
  );
}
