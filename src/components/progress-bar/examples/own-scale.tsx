/** A ranking where each row has its own scale: fleet load per model, each model out of its own fleet, each row a link — `layout`, `scale`, `max`, `href`. */
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const FLEET_LOAD: ProgressSegment[] = [
  { value: 12, max: 12, label: "КАМАЗ 54901", tone: "warning", href: "/fleet?model=kamaz-54901" },
  { value: 34, max: 40, label: "Газель Next", href: "/fleet?model=gazelle-next" },
  { value: 18, max: 24, label: "ГАЗ Валдай", href: "/fleet?model=valdai" },
  { value: 9, max: 15, label: "ГАЗон Next", href: "/fleet?model=gazon-next" },
  { value: 2, max: 8, label: "Fuso Canter", href: "/fleet?model=fuso-canter" },
];

export default function ProgressBarOwnScaleExample() {
  return (
    <div className={styles.column}>
      <ProgressBar
        layout="rows"
        scale="own"
        segments={FLEET_LOAD}
        label="Загрузка парка по моделям"
      />
    </div>
  );
}
