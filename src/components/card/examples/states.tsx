/** A KPI tile while its report loads next to the loaded one, in the `stat-trend` and `mini` templates — `loading`. */
import { Card, Icon, Typography } from "prime-ui-kit";

export default function CardStatesExample() {
  return (
    <>
      <div>
        <div>
          <Card.Root variant="stat-trend" loading>
            <Card.Label>Выручка за месяц</Card.Label>
            <Card.Value />
            <Card.Delta />
            <Card.Meta />
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            stat-trend · loading
          </Typography>
        </div>
        <div>
          <Card.Root variant="stat-trend">
            <Card.Label>Выручка за месяц</Card.Label>
            <Card.Value>4,2 млн ₽</Card.Value>
            <Card.Delta tone="success">+18% к сентябрю</Card.Delta>
            <Card.Meta>Лидов 1 240 · сделок 186</Card.Meta>
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            stat-trend
          </Typography>
        </div>
      </div>
      <div>
        <div>
          <Card.Root variant="mini" loading>
            <Card.Icon>
              <Icon name="object.users" />
            </Card.Icon>
            <Card.Label>Активные сессии</Card.Label>
            <Card.Value />
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            mini · loading
          </Typography>
        </div>
        <div>
          <Card.Root variant="mini">
            <Card.Icon>
              <Icon name="object.users" />
            </Card.Icon>
            <Card.Label>Активные сессии</Card.Label>
            <Card.Value>1 248</Card.Value>
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            mini
          </Typography>
        </div>
      </div>
    </>
  );
}
