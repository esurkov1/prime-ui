/** Delivery of outgoing messages: a clock while sending, one check when sent, two when read, and a failed one with a retry that resolves after a second — `status`, `onRetry`. */
import { Message, type MessageStatus } from "prime-ui-kit";
import * as React from "react";

const STEPS: MessageStatus[] = ["sending", "sent", "read"];

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
    <Message.Group aria-label="Статусы доставки">
      <Message.Root direction="outgoing" position="first" time="14:20" status={STEPS[step]}>
        <Message.Text>Акт сверки за сентябрь во вложении.</Message.Text>
      </Message.Root>
      <Message.Root
        direction="outgoing"
        position="last"
        time="14:21"
        status={failed ? "failed" : "sent"}
        onRetry={retry}
      >
        <Message.Text>Подпишите, пожалуйста, до пятницы.</Message.Text>
      </Message.Root>
    </Message.Group>
  );
}
