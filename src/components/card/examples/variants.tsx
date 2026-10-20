/** KPI templates: an icon tile with a value, a badge with a value in the header row, and a large value with its change in every tone and a reference line, and a line-of-text value at both steps — `variant`, `Card.Delta`, `tone`, `Card.Meta`, `valueSize`. */
import { Badge, Card, Icon, Typography } from "prime-ui-kit";

const TRENDS = [
  {
    tone: "success",
    label: "Выручка за месяц",
    value: "4,2 млн ₽",
    delta: "+18% к сентябрю",
    meta: "Лидов 1 240 · сделок 186",
  },
  {
    tone: "danger",
    label: "Отток",
    value: "3,1%",
    delta: "+0,6 п. п. за неделю",
    meta: "Ушло 38 из 1 226 клиентов",
  },
  {
    tone: "warning",
    label: "Первый ответ поддержки",
    value: "3,4 ч",
    delta: "+40 мин — близко к SLA 4 ч",
    meta: "Открыто 62 обращения",
  },
  {
    tone: "neutral",
    label: "Средний чек",
    value: "38 900 ₽",
    delta: "без изменений",
    meta: "Оплачено 214 счетов",
  },
] as const;

export default function CardVariantsExample() {
  return (
    <>
      <div>
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
        <div>
          <Card.Root variant="stat-trend">
            <Card.Header>
              <Badge.Root color="green">SLA</Badge.Root>
              <Card.Value>99,95%</Card.Value>
            </Card.Header>
            <Card.Description>Доступность API за 30 дней</Card.Description>
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            stat-trend · Card.Header
          </Typography>
        </div>
      </div>
      <div>
        {TRENDS.map((trend) => (
          <div key={trend.tone}>
            <Card.Root variant="stat-trend">
              <Card.Label>{trend.label}</Card.Label>
              <Card.Value>{trend.value}</Card.Value>
              <Card.Delta tone={trend.tone}>{trend.delta}</Card.Delta>
              <Card.Meta>{trend.meta}</Card.Meta>
            </Card.Root>
            <Typography as="span" variant="caption" tone="muted">
              stat-trend · {trend.tone}
            </Typography>
          </div>
        ))}
      </div>
      <div>
        <div>
          <Card.Root variant="stat-text">
            <Card.Label>К оплате</Card.Label>
            <Card.Value>56 000 ₽</Card.Value>
            <Card.Meta>Оплачено 200 000 ₽</Card.Meta>
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            stat-text
          </Typography>
        </div>
        <div>
          <Card.Root variant="stat-text" valueSize="l">
            <Card.Label>Сумма сделки</Card.Label>
            <Card.Value>256 000 ₽</Card.Value>
            <Card.Meta>3 скутера · 30 дней</Card.Meta>
          </Card.Root>
          <Typography as="span" variant="caption" tone="muted">
            stat-text · valueSize="l"
          </Typography>
        </div>
      </div>
    </>
  );
}
