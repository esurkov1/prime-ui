/** A column of export actions reads from the start edge, every row the full width — `align`, `fullWidth`. */
import { Button, Icon } from "prime-ui-kit";

import styles from "./examples.module.css";

const EXPORTS = [
  { icon: "object.document", label: "Счёт в PDF" },
  { icon: "object.chart", label: "Отчёт в Excel" },
  { icon: "action.send", label: "Отправить бухгалтеру" },
] as const;

export default function ButtonAlignExample() {
  return (
    <div className={styles.column}>
      {EXPORTS.map((item) => (
        <Button.Root key={item.label} variant="ghost" tone="neutral" align="start" fullWidth>
          <Button.Icon>
            <Icon name={item.icon} />
          </Button.Icon>
          {item.label}
        </Button.Root>
      ))}
    </div>
  );
}
