/** An undo window: archiving a deal turns the button into a cancel that fills over five seconds, the seconds left in a chip after the label; a press cancels, the end archives — `countdown`, `onConfirm`. */
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
