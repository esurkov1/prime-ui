/** The lead figure made of parts: on XL the ring stands in the footer left of its legend, with no media above it — `Kpi.Legend`, `ring`. */
import { Icon, Kpi, type ProgressSegment } from "prime-ui-kit";

import styles from "./examples.module.css";

const STOCK: ProgressSegment[] = [
  { value: 8364, label: "Сырьё", color: "blue" },
  { value: 5412, label: "В производстве", color: "orange" },
  { value: 7626, label: "Готовая продукция", color: "teal" },
  { value: 3198, label: "Страховой запас", color: "yellow" },
];

export default function KpiRingExample() {
  return (
    <div className={styles.hero}>
      <Kpi.Root size="xl">
        <Kpi.Icon>
          <Icon name="object.package" />
        </Kpi.Icon>
        <Kpi.Title>Склад</Kpi.Title>
        <Kpi.Description>Позиции на складах</Kpi.Description>
        <Kpi.Value>
          24 600<Kpi.Unit>позиций</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Period>на 22 окт</Kpi.Period>
        <Kpi.Meta>184 млн ₽ в запасах</Kpi.Meta>
        <Kpi.Footer>
          <Kpi.Legend segments={STOCK} ring />
        </Kpi.Footer>
      </Kpi.Root>
    </div>
  );
}
