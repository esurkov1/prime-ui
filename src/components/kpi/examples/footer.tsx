/** The footer holds one kind of new data: a note on L, totals in columns on L and XL, a breakdown in rows on XL — `Kpi.Footer`, `Kpi.Note`, `Kpi.Total`, `DescriptionList`. */
import { DescriptionList, Icon, Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

export default function KpiFooterExample() {
  return (
    <div className={styles.hero}>
      <Kpi.Root size="l">
        <Kpi.Icon>
          <Icon name="object.wallet" />
        </Kpi.Icon>
        <Kpi.Title>Просрочено</Kpi.Title>
        <Kpi.Description>Неоплаченные счета</Kpi.Description>
        <Kpi.Value>
          1 200 000<Kpi.Unit>₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={180} tone="danger">
          +180 тыс. ₽
        </Kpi.Delta>
        <Kpi.Period>на 22 окт, 09:40</Kpi.Period>
        <Kpi.Footer>
          <Kpi.Note>9 счетов ждут напоминания</Kpi.Note>
        </Kpi.Footer>
      </Kpi.Root>
      <Kpi.Root size="xl">
        <Kpi.Icon>
          <Icon name="currency.ruble" />
        </Kpi.Icon>
        <Kpi.Title>Выручка</Kpi.Title>
        <Kpi.Description>Оплаченные счета</Kpi.Description>
        <Kpi.Value>
          8 704 000<Kpi.Unit>₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={9.6} tone="success">
          +9,6 %
        </Kpi.Delta>
        <Kpi.Period>1–22 окт</Kpi.Period>
        <Kpi.Footer>
          <Kpi.Total label="Счетов">412</Kpi.Total>
          <Kpi.Total label="Средний чек">21 100 ₽</Kpi.Total>
          <Kpi.Total label="Возвраты">146 000 ₽</Kpi.Total>
        </Kpi.Footer>
      </Kpi.Root>
      <Kpi.Root size="xl">
        <Kpi.Icon>
          <Icon name="object.chart" />
        </Kpi.Icon>
        <Kpi.Title>Выручка за квартал</Kpi.Title>
        <Kpi.Description>Оплаченные счета</Kpi.Description>
        <Kpi.Value>
          24 500 000<Kpi.Unit>₽</Kpi.Unit>
        </Kpi.Value>
        <Kpi.Delta value={12.5} tone="success">
          +12,5 %
        </Kpi.Delta>
        <Kpi.Period>III кв. 2026</Kpi.Period>
        <Kpi.Meta>план 28 млн ₽ · 87 %</Kpi.Meta>
        <Kpi.Footer>
          <DescriptionList.Root align="end">
            <DescriptionList.Item label="Валовая маржа">42,8 %</DescriptionList.Item>
            <DescriptionList.Item label="Подписки">16 200 000 ₽</DescriptionList.Item>
            <DescriptionList.Item label="Средняя сделка">342 000 ₽</DescriptionList.Item>
          </DescriptionList.Root>
        </Kpi.Footer>
      </Kpi.Root>
    </div>
  );
}
