/** Twelve stage colors in a narrow column wrap by themselves into even rows, and the arrows move by the visual rows — `presets`. */
import { ColorSwatches } from "prime-ui-kit";

import styles from "./examples.module.css";

const STAGE_COLORS = [
  { value: "#ef4444", label: "Красный" },
  { value: "#f97316", label: "Оранжевый" },
  { value: "#eab308", label: "Жёлтый" },
  { value: "#22c55e", label: "Зелёный" },
  { value: "#14b8a6", label: "Бирюзовый" },
  { value: "#5068f5", label: "Синий" },
  { value: "#b91c1c", label: "Тёмно-красный" },
  { value: "#c2410c", label: "Тёмно-оранжевый" },
  { value: "#a16207", label: "Горчичный" },
  { value: "#15803d", label: "Тёмно-зелёный" },
  { value: "#0f766e", label: "Тёмно-бирюзовый" },
  { value: "#2f4ae0", label: "Тёмно-синий" },
];

export default function ColorSwatchesWrappingExample() {
  return (
    <div className={styles.narrow}>
      <ColorSwatches label="Цвет этапа" presets={STAGE_COLORS} defaultValue="#14b8a6" />
    </div>
  );
}
