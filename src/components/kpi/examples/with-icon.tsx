/** An icon tile leading the title and the line under it, centred on both — `Kpi.Icon`. */
import { Icon, Kpi, Typography } from "prime-ui-kit";

const TILES = [
  {
    icon: "object.users",
    title: "Активные клиенты",
    description: "Был заказ",
    period: "последние 90 дней",
    value: "1 248",
    caption: "Kpi.Icon",
  },
  {
    icon: "object.receipt",
    title: "Счета на подписи",
    description: "Ждут клиента",
    period: "на 22 окт",
    value: "37",
    caption: "Kpi.Icon · Kpi.Description",
  },
] as const;

export default function KpiWithIconExample() {
  return (
    <>
      {TILES.map((tile) => (
        <div key={tile.title}>
          <div>
            <Kpi.Root>
              <Kpi.Icon>
                <Icon name={tile.icon} />
              </Kpi.Icon>
              <Kpi.Title>{tile.title}</Kpi.Title>
              <Kpi.Description>{tile.description}</Kpi.Description>
              <Kpi.Period>{tile.period}</Kpi.Period>
              <Kpi.Value>{tile.value}</Kpi.Value>
            </Kpi.Root>
            <Typography as="span" variant="caption" tone="muted">
              {tile.caption}
            </Typography>
          </div>
        </div>
      ))}
    </>
  );
}
