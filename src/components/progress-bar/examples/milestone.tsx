/** A rare milestone: the last invoice of the quarter fills the bar, the tone turns success and a short confetti burst marks it — `value`, `tone`, `celebrate()`. */
import { Button, celebrate, ProgressBar } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const INVOICES = 12;

export default function ProgressBarMilestoneExample() {
  const [paid, setPaid] = React.useState(INVOICES - 1);
  const closed = paid === INVOICES;

  return (
    <div className={styles.column}>
      <ProgressBar
        value={paid}
        max={INVOICES}
        tone={closed ? "success" : "accent"}
        label={
          closed
            ? "III квартал закрыт: все счета оплачены"
            : `Оплачено счетов: ${paid} из ${INVOICES}`
        }
      />
      <div className={styles.actions}>
        <Button.Root
          variant={closed ? "soft" : "solid"}
          tone={closed ? "neutral" : "accent"}
          onClick={(event) => {
            if (closed) {
              setPaid(INVOICES - 1);
              return;
            }
            setPaid(INVOICES);
            celebrate({ origin: event.currentTarget });
          }}
        >
          {closed ? "Вернуть последний счёт" : "Отметить оплату ООО «Вектор»"}
        </Button.Root>
      </div>
    </div>
  );
}
