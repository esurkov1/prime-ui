/** Whole cards as links to their reports: one tab stop each, a lift on hover, a press and the focus ring — `asChild`. */
import { Card, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const REPORTS = [
  { href: "#orders", icon: "object.package", label: "Заказы за неделю", value: "1 248" },
  { href: "#invoices", icon: "object.receipt", label: "Счета к оплате", value: "37" },
  { href: "#team", icon: "object.users", label: "Активные менеджеры", value: "18" },
] as const;

export default function CardInteractiveExample() {
  return (
    <div className={styles.grid}>
      {REPORTS.map((report) => (
        <Card.Root key={report.href} variant="mini" asChild>
          <a href={report.href}>
            <Card.Icon>
              <Icon name={report.icon} />
            </Card.Icon>
            <Card.Label>{report.label}</Card.Label>
            <Card.Value>{report.value}</Card.Value>
          </a>
        </Card.Root>
      ))}
    </div>
  );
}
