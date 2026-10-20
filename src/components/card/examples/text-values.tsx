/** Summary tiles whose value is a line of text a step larger than the label, a phrase and a number alike, one of them in a tone — `variant`, `stat-text`, `valueSize`, `tone`. */
import { Card } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function CardTextValuesExample() {
  return (
    <div className={styles.grid}>
      <Card.Root variant="stat-text" valueSize="l">
        <Card.Label>Следующий шаг</Card.Label>
        <Card.Value>Выдать PCX 160</Card.Value>
        <Card.Meta>Сегодня до 18:00</Card.Meta>
      </Card.Root>
      <Card.Root variant="stat-text" valueSize="l">
        <Card.Label>Источник</Card.Label>
        <Card.Value>Заявка в Mini App</Card.Value>
        <Card.Meta>Создана 14 октября</Card.Meta>
      </Card.Root>
      <Card.Root variant="stat-text" valueSize="l">
        <Card.Label>К оплате</Card.Label>
        <Card.Value tone="warning">256 000 ₽</Card.Value>
        <Card.Meta>Оплачено 200 000 ₽</Card.Meta>
      </Card.Root>
    </div>
  );
}
