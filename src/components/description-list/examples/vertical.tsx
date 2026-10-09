/** Labels above their values at any width, for a side panel of a record — `orientation`. */
import { Card, DescriptionList } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DescriptionListVerticalExample() {
  return (
    <Card.Root className={styles.side}>
      <Card.Body>
        <DescriptionList.Root orientation="vertical">
          <DescriptionList.Item label="Сделка">
            Поставка оборудования, 2-й этап
          </DescriptionList.Item>
          <DescriptionList.Item label="Сумма">1 250 000 ₽</DescriptionList.Item>
          <DescriptionList.Item label="Ответственный">Анна Ким</DescriptionList.Item>
          <DescriptionList.Item label="Срок">15 ноября 2026</DescriptionList.Item>
        </DescriptionList.Root>
      </Card.Body>
    </Card.Root>
  );
}
