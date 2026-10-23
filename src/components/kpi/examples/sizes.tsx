/** One figure on four sizes, each with everything it holds: S — the title, the period, the value and the change; M adds a badge, the note and the chart; L the icon, the description, a button and totals; XL four totals and a menu — `size`. */
import {
  Badge,
  Button,
  Dropdown,
  Icon,
  Kpi,
  Sparkline,
  type SparklinePoint,
  Typography,
} from "prime-ui-kit";

/** Daily revenue of 1–22 October, thousands of rubles. */
const REVENUE: SparklinePoint[] = Array.from({ length: 22 }, (_, i) => {
  const date = new Date(2026, 9, 1 + i);
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  const value = 440 + 60 * Math.sin(i / 3.4) + i * 2.4;
  return { date, value: Math.round(weekend ? value * 0.45 : value) };
});

const SIZES = ["s", "m", "l", "xl"] as const;

export default function KpiSizesExample() {
  return (
    <>
      <div>
        {SIZES.map((size) => (
          <div key={size}>
            <Kpi.Root size={size}>
              <Kpi.Icon>
                <Icon name="currency.ruble" />
              </Kpi.Icon>
              <Kpi.Title>Выручка</Kpi.Title>
              <Kpi.Description>Оплаченные счета</Kpi.Description>
              <Kpi.Actions>
                {size === "m" ? <Badge.Root>Прогноз</Badge.Root> : null}
                {size === "l" ? (
                  <Button.Root variant="soft" tone="neutral">
                    Отчёт
                  </Button.Root>
                ) : null}
                {size === "xl" ? (
                  <Dropdown.Root>
                    <Dropdown.Trigger>
                      <Button.Root variant="soft" tone="neutral" aria-label="Ещё">
                        <Button.Icon>
                          <Icon name="action.more" />
                        </Button.Icon>
                      </Button.Root>
                    </Dropdown.Trigger>
                    <Dropdown.Content align="end">
                      <Dropdown.Item>Открыть отчёт</Dropdown.Item>
                      <Dropdown.Item>Выгрузить</Dropdown.Item>
                    </Dropdown.Content>
                  </Dropdown.Root>
                ) : null}
              </Kpi.Actions>
              <Kpi.Value>
                {size === "s" || size === "m" ? "8,7" : "8 704 000"}
                <Kpi.Unit>{size === "s" || size === "m" ? "млн ₽" : "₽"}</Kpi.Unit>
              </Kpi.Value>
              <Kpi.Delta value={9.6} tone="success">
                +9,6 %
              </Kpi.Delta>
              <Kpi.Period>1–22 окт</Kpi.Period>
              <Kpi.Meta>план 9,5 млн ₽</Kpi.Meta>
              <Kpi.Media>
                <Sparkline data={REVENUE} label="Выручка по дням" />
              </Kpi.Media>
              <Kpi.Footer>
                <Kpi.Total label="Счетов">412</Kpi.Total>
                <Kpi.Total label="Средний чек">21 100 ₽</Kpi.Total>
                <Kpi.Total label="Возвраты">146 000 ₽</Kpi.Total>
              </Kpi.Footer>
            </Kpi.Root>
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        ))}
      </div>
    </>
  );
}
