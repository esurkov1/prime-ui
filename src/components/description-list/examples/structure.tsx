/** Optional pieces of a pair: a Badge or a link as the value, a row action that is a link and an empty value with its own mark — `DescriptionList.ItemAction`, `asChild`, `labels`. */
import { Badge, DescriptionList, Icon, LinkButton } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DescriptionListStructureExample() {
  return (
    <div className={styles.column}>
      <DescriptionList.Root labels={{ empty: "Нет", emptyText: "Нет данных" }}>
        <DescriptionList.Item label="Статус">
          <Badge.Root tone="success">Оплачен</Badge.Root>
        </DescriptionList.Item>
        <DescriptionList.Item label="Договор">
          <LinkButton href="#contract-118">Договор № 118 от 12 марта</LinkButton>
        </DescriptionList.Item>
        <DescriptionList.Item label="Почта">
          finance@severny-veter.ru
          <DescriptionList.ItemAction label="Написать" asChild>
            <a href="mailto:finance@severny-veter.ru">
              <Icon name="action.send" />
            </a>
          </DescriptionList.ItemAction>
        </DescriptionList.Item>
        <DescriptionList.Item label="Скидка">{null}</DescriptionList.Item>
      </DescriptionList.Root>
    </div>
  );
}
