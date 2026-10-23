/** The right slot of the head holds one thing: a badge or a menu on M, a button on L; it stands at the top end and never shrinks — `Kpi.Actions`. */
import { Badge, Button, Dropdown, Icon, Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiActionsExample() {
  return (
    <div className={styles.wide}>
      <Kpi.Root>
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Actions>
          <Badge.Root>Прогноз</Badge.Root>
        </Kpi.Actions>
        <Kpi.Value>
          9,4<Kpi.Unit>млн ₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Period>Октябрь</Kpi.Period>
        <Kpi.Meta>по оплатам до 22 окт</Kpi.Meta>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Новые клиенты</Kpi.Title>
        <Kpi.Actions>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button.Root variant="soft" tone="neutral" aria-label="Ещё">
                <Button.Icon>
                  <Icon name="action.more" />
                </Button.Icon>
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
              <Dropdown.Item>
                <Dropdown.ItemIcon>
                  <Icon name="action.download" />
                </Dropdown.ItemIcon>
                Выгрузить список
              </Dropdown.Item>
              <Dropdown.Item>
                <Dropdown.ItemIcon>
                  <Icon name="object.chart" />
                </Dropdown.ItemIcon>
                Открыть отчёт
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </Kpi.Actions>
        <Kpi.Value>38</Kpi.Value>
        <Kpi.Delta value={6} tone="success">
          +6
        </Kpi.Delta>
        <Kpi.Period>Октябрь</Kpi.Period>
      </Kpi.Root>
      <Kpi.Root size="l">
        <Kpi.Icon>
          <Icon name="object.wallet" />
        </Kpi.Icon>
        <Kpi.Title>Просрочено</Kpi.Title>
        <Kpi.Description>Неоплаченные счета</Kpi.Description>
        <Kpi.Actions>
          <Button.Root variant="soft" tone="neutral">
            Напомнить
          </Button.Root>
        </Kpi.Actions>
        <Kpi.Value>
          1 200 000<Kpi.Unit>₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={180} tone="danger">
          +180 тыс. ₽
        </Kpi.Delta>
        <Kpi.Period>на 22 окт, 09:40</Kpi.Period>
        <Kpi.Meta>9 счетов · 4 клиента</Kpi.Meta>
      </Kpi.Root>
    </div>
  );
}
