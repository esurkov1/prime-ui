/** The tags of a client as one value: the row wraps in a narrow column and keeps one gap between badges — `Badge.Group`, `size`. */
import { Badge } from "prime-ui-kit";

import styles from "./examples.module.css";

const TAGS = [
  { label: "Ключевой клиент", color: "purple" },
  { label: "Оптовые закупки", color: "blue" },
  { label: "Отсрочка 30 дней", color: "orange" },
  { label: "ЭДО", color: "teal" },
  { label: "Москва", color: "gray" },
  { label: "Новый договор", color: "green" },
] as const;

export default function BadgeTagRowExample() {
  return (
    <div className={styles.column}>
      <Badge.Group aria-label="Теги клиента">
        {TAGS.map((tag) => (
          <Badge.Root key={tag.label} color={tag.color}>
            {tag.label}
          </Badge.Root>
        ))}
      </Badge.Group>
      <Badge.Group size="s" aria-label="Теги заказа">
        {TAGS.slice(0, 4).map((tag) => (
          <Badge.Root key={tag.label} color={tag.color}>
            {tag.label}
          </Badge.Root>
        ))}
      </Badge.Group>
    </div>
  );
}
