/** Delivery of outgoing messages: a clock while sending, one check when sent, two when read, and a failed one with a retry that resolves after a second; the time comes as a date and reads to the second — `status`, `onRetry`, `formatTime`. */
import { Message, type MessageStatus } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

const STEPS: MessageStatus[] = ["sending", "sent", "read"];

const FIRST_AT = new Date(2026, 9, 8, 14, 20, 12);
const SECOND_AT = new Date(2026, 9, 8, 14, 21, 37);

/** «14:21:37»: a delivery to the second, as the support log reads it. */
const SECONDS = new Intl.DateTimeFormat("ru", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});
const formatSeconds = (date: Date) => SECONDS.format(date);

export default function MessageStatusExample() {
  const [step, setStep] = React.useState(0);
  const [failed, setFailed] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setInterval(
      () => setStep((current) => (current + 1) % STEPS.length),
      1600,
    );
    return () => window.clearInterval(timer);
  }, []);

  const retry = () =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setFailed(false);
        resolve();
      }, 1000);
    });

  return (
    <div className={styles.thread}>
      <Message.Root
        direction="outgoing"
        position="first"
        time={FIRST_AT}
        formatTime={formatSeconds}
        status={STEPS[step]}
      >
        <Message.Text>Акт сверки за сентябрь во вложении.</Message.Text>
      </Message.Root>
      <Message.Root
        direction="outgoing"
        position="last"
        time={SECOND_AT}
        formatTime={formatSeconds}
        status={failed ? "failed" : "sent"}
        onRetry={retry}
      >
        <Message.Text>Подпишите, пожалуйста, до пятницы.</Message.Text>
      </Message.Root>
    </div>
  );
}
