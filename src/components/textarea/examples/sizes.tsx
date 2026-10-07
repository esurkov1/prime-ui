/** Five tiers side by side: text, padding, label and hint come from the size. Pick the size that matches the neighbouring fields. */
import { Textarea } from "prime-ui-kit";
import styles from "./examples.module.css";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function TextareaSizesExample() {
  return (
    <div className={styles.sizesGrid}>
      {SIZES.map((size) => (
        <Textarea.Root
          key={size}
          size={size}
          label={`Размер ${size}`}
          placeholder="Комментарий"
          hint={`Подсказка яруса ${size}`}
        />
      ))}
    </div>
  );
}
