/** Optional pieces of a pair: a Badge or a link as the value, a row action and an empty value with its own mark — `DescriptionList.ItemAction`, `labels`. */
import { Badge, DescriptionList, Icon, LinkButton } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function DescriptionListStructureExample() {
  return (
    <div className={styles.column}>
      <DescriptionList.Root labels={{ empty: "Нет", emptyText: "Нет данных" }}>
        <DescriptionList.Item label="Статус">
          <Badge.Root color="green">Оплачен</Badge.Root>
        </DescriptionList.Item>
        <DescriptionList.Item label="Договор">
          <LinkButton href="#contract-118">Договор № 118 от 12 марта</LinkButton>
        </DescriptionList.Item>
        <DescriptionList.Item label="Email">
          finance@severny-veter.ru
          <DescriptionList.ItemAction
            label="Написать"
            onClick={() => window.open("mailto:finance@severny-veter.ru")}
          >
            <Icon name="action.send" />
          </DescriptionList.ItemAction>
        </DescriptionList.Item>
        <DescriptionList.Item label="Скидка">{null}</DescriptionList.Item>
      </DescriptionList.Root>
    </div>
  );
}
