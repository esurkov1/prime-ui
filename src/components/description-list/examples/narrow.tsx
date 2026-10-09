/** In a 320 px card the list is narrower than 24rem: each label moves above its value and long values wrap. */
import { Card, DescriptionList } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DescriptionListNarrowExample() {
  return (
    <Card.Root className={styles.narrow}>
      <Card.Body>
        <DescriptionList.Root>
          <DescriptionList.Item label="Компания">ООО «Северный ветер»</DescriptionList.Item>
          <DescriptionList.Item label="Электронная почта">
            finance.department@severny-veter-logistics.ru
          </DescriptionList.Item>
          <DescriptionList.Item label="Менеджер">{null}</DescriptionList.Item>
        </DescriptionList.Root>
      </Card.Body>
    </Card.Root>
  );
}
