/** A client's details in a card: labels beside values, a long address that wraps, an empty manager and a copy action — `DescriptionList.Item`, `label`, `DescriptionList.ItemAction`. */
import { Card, DescriptionList, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const INN = "7704512398";

export default function DescriptionListOverviewExample() {
  return (
    <Card.Root className={styles.card}>
      <Card.Header>
        <Card.Title>Реквизиты клиента</Card.Title>
      </Card.Header>
      <Card.Body>
        <DescriptionList.Root>
          <DescriptionList.Item label="Компания">ООО «Северный ветер»</DescriptionList.Item>
          <DescriptionList.Item label="ИНН">
            {INN}
            <DescriptionList.ItemAction
              label="Копировать ИНН"
              onClick={() => navigator.clipboard?.writeText(INN)}
            >
              <Icon name="action.copy" />
            </DescriptionList.ItemAction>
          </DescriptionList.Item>
          <DescriptionList.Item label="Телефон">+7 495 120-44-18</DescriptionList.Item>
          <DescriptionList.Item label="Юридический адрес">
            125167, г. Москва, Ленинградский проспект, д. 37, корп. 9, этаж 4, помещение XII
          </DescriptionList.Item>
          <DescriptionList.Item label="Менеджер">{null}</DescriptionList.Item>
        </DescriptionList.Root>
      </Card.Body>
    </Card.Root>
  );
}
