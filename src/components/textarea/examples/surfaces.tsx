/** A field whose fill follows the surface: white on the canvas, gray inside Card, Modal or Popover. Drop it into any surface without overriding the background. */
import { Textarea } from "prime-ui-kit";
import styles from "./examples.module.css";

export default function TextareaSurfacesExample() {
  return (
    <div className={styles.surfaceField}>
      <Textarea.Root label="Заметка" placeholder="Текст заметки" hint="Видна всей команде." />
    </div>
  );
}
