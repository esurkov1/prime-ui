/** Fact cards of a record whose value is a line of text in one style, a phrase and a number alike, one of them in a tone — `valueSize`, `tone`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiTextValuesExample() {
  return (
    <div className={styles.grid}>
      <Kpi.Root valueSize="s">
        <Kpi.Title>Следующий шаг</Kpi.Title>
        <Kpi.Value>Выдать PCX 160</Kpi.Value>
        <Kpi.Meta>Сегодня до 18:00</Kpi.Meta>
      </Kpi.Root>
      <Kpi.Root valueSize="s">
        <Kpi.Title>Источник</Kpi.Title>
        <Kpi.Value>Заявка в Mini App</Kpi.Value>
        <Kpi.Meta>Создана 14 октября</Kpi.Meta>
      </Kpi.Root>
      <Kpi.Root valueSize="s">
        <Kpi.Title>К оплате</Kpi.Title>
        <Kpi.Value tone="warning">56 000 ₽</Kpi.Value>
        <Kpi.Meta>Оплачено 200 000 ₽</Kpi.Meta>
      </Kpi.Root>
    </div>
  );
}
