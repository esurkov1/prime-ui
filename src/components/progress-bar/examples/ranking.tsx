/** Rankings as rows of label · value · share over a bar: top cities against the leader and a funnel against its first step, each step a link — `layout`, `scale`, `href`. */
import { ProgressBar, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const CITIES: ProgressSegment[] = [
  { value: 1_284, label: "Москва" },
  { value: 642, label: "Санкт-Петербург" },
  { value: 318, label: "Казань" },
  { value: 204, label: "Екатеринбург" },
  { value: 96, label: "Новосибирск" },
];

const FUNNEL: ProgressSegment[] = [
  { value: 2_400, label: "Заявка", href: "/deals?stage=request" },
  { value: 1_380, label: "Квалификация", href: "/deals?stage=qualification" },
  { value: 620, label: "Предложение", href: "/deals?stage=offer" },
  { value: 214, label: "Сделка", href: "/deals?stage=won" },
];

export default function ProgressBarRankingExample() {
  return (
    <div className={styles.column}>
      <ProgressBar layout="rows" scale="max" segments={CITIES} label="Заказы по городам" />
      <ProgressBar layout="rows" scale="first" segments={FUNNEL} label="Воронка за квартал" />
    </div>
  );
}
