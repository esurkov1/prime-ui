/** A setting saved once the thumb is let go, not on every step: the thumb waits dimmed while it saves, and a value the server refuses glides back — `onCommit`, `hint`, `error`. */
import { Slider } from "prime-ui-kit";
import * as React from "react";

/** The server saving the reminder lead time a beat later: more than ten days is not allowed. */
function saveLeadTime(days: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (days > 10) reject(new Error("Тариф позволяет напоминать не раньше чем за 10 дней"));
      else resolve();
    }, 600);
  });
}

export default function SliderAutosaveExample() {
  const [error, setError] = React.useState<string>();

  return (
    <Slider
      label="Напоминать об оплате счёта"
      min={1}
      max={14}
      defaultValue={3}
      showValue
      formatValue={(days) => `за ${days} дн.`}
      hint="Сохраняется само, когда вы отпустите ползунок"
      error={error}
      onCommit={async (days) => {
        setError(undefined);
        try {
          await saveLeadTime(days);
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : String(reason));
          throw reason;
        }
      }}
    />
  );
}
