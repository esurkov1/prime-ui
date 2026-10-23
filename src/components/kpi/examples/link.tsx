/** A card that opens its report: the whole card as one link when nothing inside is a control, or a link in the title that stretches over the card when it holds a chart — `asChild`, `Kpi.Link`. */
import { Kpi, Sparkline, type SparklinePoint } from "prime-ui-kit";

import styles from "./examples.module.css";

/** Leads per day, 1–8 October. */
const LEADS: SparklinePoint[] = [42, 51, 47, 58, 63, 55, 61, 70].map((value, i) => ({
  date: new Date(2026, 9, 1 + i),
  value,
}));

export default function KpiLinkExample() {
  return (
    <div className={styles.row}>
      <Kpi.Root asChild>
        <a href="#revenue">
          <Kpi.Title>Выручка</Kpi.Title>
          <Kpi.Value>
            8,7<Kpi.Unit>млн ₽</Kpi.Unit>
          </Kpi.Value>
          <Kpi.Delta value={9.6} tone="success">
            +9,6 %
          </Kpi.Delta>
          <Kpi.Period>1–22 окт</Kpi.Period>
        </a>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>
          <Kpi.Link href="#leads">Лиды</Kpi.Link>
        </Kpi.Title>
        <Kpi.Value>447</Kpi.Value>
        <Kpi.Delta value={12} tone="success">
          +12 %
        </Kpi.Delta>
        <Kpi.Period>1–8 окт</Kpi.Period>
        <Kpi.Media>
          <Sparkline data={LEADS} label="Лиды по дням" />
        </Kpi.Media>
      </Kpi.Root>
    </div>
  );
}
