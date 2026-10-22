/** The change in every tone, chosen by its meaning and not by its sign: churn up is bad, the arrow still shows where it went — `Kpi.Delta`, `tone`. */
import { Kpi, Typography } from "prime-ui-kit";

const TRENDS = [
  {
    tone: "success",
    title: "Выручка",
    value: "4,2 млн ₽",
    change: 18,
    delta: "+18%",
    meta: "к сентябрю",
  },
  {
    tone: "danger",
    title: "Отток",
    value: "3,1%",
    change: 0.6,
    delta: "+0,6 п. п.",
    meta: "за неделю",
  },
  {
    tone: "warning",
    title: "Первый ответ",
    value: "3,4 ч",
    change: 40,
    delta: "+40 мин",
    meta: "близко к SLA 4 ч",
  },
  {
    tone: "neutral",
    title: "Средний чек",
    value: "38 900 ₽",
    change: 0,
    delta: "0%",
    meta: "к сентябрю",
  },
] as const;

export default function KpiVariantsExample() {
  return (
    <>
      {TRENDS.map((trend) => (
        <div key={trend.tone}>
          <div>
            <Kpi.Root>
              <Kpi.Title>{trend.title}</Kpi.Title>
              <Kpi.Period>Октябрь</Kpi.Period>
              <Kpi.Value>{trend.value}</Kpi.Value>
              <Kpi.Delta value={trend.change} tone={trend.tone}>
                {trend.delta}
              </Kpi.Delta>
              <Kpi.Meta>{trend.meta}</Kpi.Meta>
            </Kpi.Root>
            <Typography as="span" variant="caption" tone="muted">
              {trend.tone}
            </Typography>
          </div>
        </div>
      ))}
    </>
  );
}
