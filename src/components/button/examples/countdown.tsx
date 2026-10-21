/** A delayed action: archiving a deal waits five seconds behind a cancel that fills and counts them down; a press cancels, the end archives — `countdown`, `countdownMode`, `onConfirm`. */
import { Button, Icon } from "prime-ui-kit";
import * as React from "react";

type Step = "idle" | "pending" | "archived";

export default function ButtonCountdownExample() {
  const [step, setStep] = React.useState<Step>("idle");

  if (step === "pending") {
    return (
      <Button.Root
        variant="soft"
        tone="neutral"
        countdown={5}
        countdownMode="delay"
        onConfirm={() => setStep("archived")}
        onClick={() => setStep("idle")}
      >
        Отменить
      </Button.Root>
    );
  }
  return (
    <Button.Root
      variant="soft"
      tone="neutral"
      disabled={step === "archived"}
      onClick={() => setStep("pending")}
    >
      <Button.Icon>
        <Icon name="action.check" />
      </Button.Icon>
      {step === "archived" ? "Сделка в архиве" : "В архив"}
    </Button.Root>
  );
}
