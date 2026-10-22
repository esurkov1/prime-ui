/** Cards that are links to their reports: one tab stop each, the corner arrow, a lift on hover and the focus ring; the title keeps clear of the arrow — `asChild`. */
import { Kpi } from "prime-ui-kit";

import styles from "./examples.module.css";

const REPORTS = [
  {
    href: "#invoices",
    title: "Счета к оплате",
    period: "на 22 окт",
    value: "37",
    meta: "на 1,8 млн ₽",
  },
  { href: "#orders", title: "Заказы", period: "1–22 окт", value: "1 248", meta: "из них 96 новых" },
];

export default function KpiLinkExample() {
  return (
    <div className={styles.wide}>
      {REPORTS.map((report) => (
        <Kpi.Root key={report.href} asChild>
          <a href={report.href}>
            <Kpi.Title>{report.title}</Kpi.Title>
            <Kpi.Period>{report.period}</Kpi.Period>
            <Kpi.Value>{report.value}</Kpi.Value>
            <Kpi.Meta>{report.meta}</Kpi.Meta>
          </a>
        </Kpi.Root>
      ))}
    </div>
  );
}
