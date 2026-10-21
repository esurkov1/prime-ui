/** An undo window: marking a task done happens at once, and the button turns into a cancel that fills over five seconds; a press undoes it, the end closes the window — `countdown`, `onConfirm`. */
import { Button, Icon } from "prime-ui-kit";
import * as React from "react";

type Step = "open" | "undo" | "done";

export default function ButtonUndoExample() {
  const [step, setStep] = React.useState<Step>("open");

  if (step === "undo") {
    return (
      <Button.Root
        variant="soft"
        tone="neutral"
        countdown={5}
        onConfirm={() => setStep("done")}
        onClick={() => setStep("open")}
      >
        Отменить
      </Button.Root>
    );
  }
  return (
    <Button.Root
      variant="soft"
      tone={step === "done" ? "success" : "neutral"}
      disabled={step === "done"}
      onClick={() => setStep("undo")}
    >
      <Button.Icon>
        <Icon name="action.check" />
      </Button.Icon>
      {step === "done" ? "Задача выполнена" : "Выполнено"}
    </Button.Root>
  );
}
