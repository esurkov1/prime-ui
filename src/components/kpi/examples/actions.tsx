/** Actions in the top end of the card: a button for the step it calls for, a menu for the rest; the figure and its change stay in their places — `Kpi.Actions`. */
import { Button, Dropdown, Icon, Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiActionsExample() {
  return (
    <div className={styles.wide}>
      <Kpi.Root>
        <Kpi.Title>Просрочено</Kpi.Title>
        <Kpi.Description>9 счетов</Kpi.Description>
        <Kpi.Period>на 22 окт, 09:40</Kpi.Period>
        <Kpi.Actions>
          <Button.Root variant="soft" tone="neutral" size="s">
            Напомнить
          </Button.Root>
        </Kpi.Actions>
        <Kpi.Value>1,2 млн ₽</Kpi.Value>
        <Kpi.Delta value={180} tone="danger">
          +180 тыс. ₽
        </Kpi.Delta>
        <Kpi.Meta>за неделю · старейший — 41 день</Kpi.Meta>
      </Kpi.Root>
      <Kpi.Root>
        <Kpi.Title>Новые клиенты</Kpi.Title>
        <Kpi.Period>Октябрь</Kpi.Period>
        <Kpi.Actions>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button.Root variant="ghost" tone="neutral" size="s" aria-label="Ещё">
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
        <Kpi.Meta>к сентябрю</Kpi.Meta>
      </Kpi.Root>
    </div>
  );
}
