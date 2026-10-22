/** The card at every tier: the padding steps 16 · 20 · 24 and the button in its actions takes the tier, the text keeps its roles — `size`. */
import { Button, Kpi, Typography } from "prime-ui-kit";

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function KpiSizesExample() {
  return (
    <>
      {SIZES.map((size) => (
        <div key={size}>
          <div>
            <Kpi.Root size={size}>
              <Kpi.Title>Просрочено</Kpi.Title>
              <Kpi.Period>на 22 окт</Kpi.Period>
              <Kpi.Actions>
                <Button.Root variant="soft" tone="neutral">
                  Напомнить
                </Button.Root>
              </Kpi.Actions>
              <Kpi.Value>1,2 млн ₽</Kpi.Value>
              <Kpi.Delta value={180} tone="danger">
                +180 тыс. ₽
              </Kpi.Delta>
            </Kpi.Root>
            <Typography as="span" variant="caption" tone="muted">
              {size}
            </Typography>
          </div>
        </div>
      ))}
    </>
  );
}
